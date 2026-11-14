"""Extract all public content from the legacy `thai` static site into JSON
files consumed by the Next.js frontend. Usage: build_content.py <thai_dir> <out_dir>"""
import json, os, re, sys
from bs4 import BeautifulSoup, NavigableString

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

def soup(path):
    return BeautifulSoup(open(os.path.join(SRC, path), encoding='utf8').read(), 'html.parser')

def txt(el):
    if el is None:
        return ''
    return re.sub(r'\s+', ' ', el.get_text(' ', strip=True)).replace(' ,', ',').replace(' .', '.').strip()

def strip_icon(s):
    return re.sub(r'^[✓✕✔★✦•\s]+', '', s).strip()

def img_path(src):
    """Map legacy relative asset path -> public path."""
    if not src:
        return ''
    src = src.split('?')[0]
    m = re.search(r'(assets/.+)$', src)
    if m:
        p = m.group(1)
        return '/' + p
    m = re.search(r'([^/]+\.(png|jpe?g|webp|svg))$', src)
    return '/' + m.group(1) if m else src

def bg_url(style):
    m = re.search(r"url\(['\"]?([^'\")]+)", style or '')
    return img_path(m.group(1)) if m else ''

def clean_html(el, keep=('p','h2','h3','h4','ul','ol','li','strong','em','b','i','blockquote','a','br','table','thead','tbody','tr','th','td','span','div','figure','figcaption','img')):
    """Return simplified inner HTML (no classes/styles/scripts)."""
    el = BeautifulSoup(str(el), 'html.parser')
    for bad in el.find_all(['script','style','svg','button','form','input','noscript']):
        bad.decompose()
    for t in el.find_all(True):
        if t.name not in keep:
            t.unwrap(); continue
        attrs = {}
        if t.name == 'a' and t.get('href'):
            attrs['href'] = link(t['href'])
        if t.name == 'img':
            attrs['src'] = img_path(t.get('src')); attrs['alt'] = t.get('alt','')
        t.attrs = attrs
    for t in el.find_all(['span','div']):
        t.unwrap()
    h = str(el)
    h = re.sub(r'\s+', ' ', h)
    blk = r'(?:p|h2|h3|h4|ul|ol|li|blockquote|table|thead|tbody|tr|th|td|figure|figcaption)'
    h = re.sub(r'\s*(</?' + blk + r'\b[^>]*>)\s*', r'\1', h)
    return h.strip()

ROUTES = {
    'index.html': '/', 'about.html': '/about', 'contact.html': '/contact', 'destinations.html': '/destinations',
    'experiences.html': '/experiences', 'gallery.html': '/gallery', 'reviews.html': '/reviews', 'blog.html': '/blog',
    'inquiry-detailed.html': '/inquiry', 'inquiry-quick.html': '/inquiry/quick', 'privacy-policy.html': '/privacy-policy',
    'terms-conditions.html': '/terms-conditions', 'cancellation-policy.html': '/cancellation-policy', 'cookie-policy.html': '/cookie-policy',
    'cultural-tours.html': '/tours/cultural', 'ayurvedic-tours.html': '/tours/ayurvedic', 'wildlife-tours.html': '/tours/wildlife',
}
def link(href):
    if not href or href.startswith(('http', 'mailto:', 'tel:', '#')):
        return href
    h = href
    q = ''
    if '?' in h:
        h, q = h.split('?', 1); q = '?' + q
    h = re.sub(r'^(\./|\.\./)+', '', h)
    h = h.replace('index.html', '').rstrip('/')
    base = h.split('/')[-1]
    if base in ROUTES:
        return ROUTES[base] + q
    if h.startswith(('tours', 'destinations', 'blog')):
        return '/' + h + q
    return '/' + h + q

# ---------------------------------------------------------------- packages (structured data)
pk = json.load(open(os.path.join(SRC, 'data/packages.json')))
pkg_json = {p['slug']: p for p in pk['packages']}
cat_json = pk['categories']
comparison = json.load(open(os.path.join(SRC, 'data/comparison_tables.json')))

CAT_ORDER = ['cultural','buddhist-heritage','wildlife','beach','hill-country','ayurvedic','honeymoon','family','adventure','golf','ramayana']

# ---------------------------------------------------------------- category pages
def parse_watermark_header(sec):
    h = sec.select_one('.section-watermark-header')
    if not h:
        return {}
    title = sec.select_one('.section-header-title') or h.find(['h2'])
    accent = title.find('span') if title else None
    main = ''
    if title:
        parts = [s for s in title.find_all(string=True, recursive=False)]
        main = re.sub(r'\s+', ' ', ' '.join(parts)).strip()
    return {'watermark': txt(h.select_one('.watermark-heading')), 'title': main or txt(title), 'accent': txt(accent)}

categories = []
for slug in CAT_ORDER:
    s = soup(f'tours/{slug}/index.html')
    c = {'slug': slug, 'metaTitle': txt(s.title), 'metaDescription': (s.find('meta', attrs={'name':'description'}) or {}).get('content','')}
    cj = cat_json.get(slug, {})
    c['data'] = {k: cj.get(k) for k in ('title','titleHighlight','tagline','description','overviewTitle','overviewText','watermark','heroImage','mapHeading','mapDescription')}
    hero = s.find('section')
    lead = None
    for p in hero.find_all('p'):
        if 'hero-slogan' not in (p.get('class') or []):
            lead = p; break
    c['hero'] = {
        'badge': txt(hero.select_one('.sacred-badge-tag, .hero-badge')).replace('✦','').strip(),
        'title': txt(hero.select_one('.hero-title-main')) or txt(hero.find('h1')),
        'accent': txt(hero.select_one('.hero-title-accent, .hero-slogan')),
        'lead': txt(lead),
        'primaryCta': txt(hero.select_one('.btn-editorial-primary span')),
        'secondaryCta': txt(hero.select_one('.btn-editorial-secondary span')),
        'image': bg_url(hero.get('style')) or ('/' + cj['heroImage'] if cj.get('heroImage') else ''),
    }
    # overview
    if slug == 'buddhist-heritage':
        hc = s.select_one('.section-header-center')
        c['overview'] = {'watermark': txt(hc.select_one('.section-tag')), 'title': txt(hc.find('h2')), 'accent': '', 'paragraphs': [txt(hc.find('p'))]}
    else:
        ov = hero.find_next_sibling('section')
        c['overview'] = {**parse_watermark_header(ov), 'paragraphs': [txt(p) for p in ov.find_all('p') if 'watermark-heading' not in (p.get('class') or [])]}
    # package cards
    cards = []
    for art in s.select('article.beach-package-card'):
        cards.append({
            'slug': art.get('data-package-slug') or art.select_one('a.btn-beach-view')['href'].split('/')[0],
            'image': img_path(art.find('img')['src']),
            'badge': txt(art.select_one('.beach-tag-badge')),
            'duration': txt(art.select_one('.beach-duration-pill')),
            'label': txt(art.select_one('.beach-card-category')),
            'title': txt(art.select_one('.beach-card-title')),
            'route': txt(art.select_one('.beach-card-route')).replace('Route:', '').strip(),
            'desc': txt(art.select_one('.beach-card-desc')),
            'highlights': [strip_icon(txt(li)) for li in art.select('.beach-card-highlights li')],
        })
    for art in s.select('article.tour-card'):
        meta = [txt(x) for x in art.select('.tour-card-meta span')]
        cards.append({
            'slug': art.select_one('.tour-card-title a')['href'].split('/')[0],
            'image': img_path(art.find('img')['src']), 'badge': txt(art.select_one('.tour-card-badge')),
            'duration': re.sub(r'^⏱️\s*', '', meta[0]) if meta else '', 'label': meta[1] if len(meta) > 1 else '',
            'title': txt(art.select_one('.tour-card-title')), 'route': '', 'desc': txt(art.select_one('.tour-card-desc')),
            'highlights': [], 'price': txt(art.select_one('.tour-price-box')),
        })
    ps = s.select_one('.beach-packages-section')
    if ps:
        c['packagesSection'] = {**parse_watermark_header(ps), 'subtitle': txt(ps.find('p', class_='text-center')), 'cards': cards}
    else:
        c['packagesSection'] = {'watermark': '', 'title': '', 'accent': '', 'subtitle': '', 'cards': cards}
    comp = s.select_one('#package-comparison')
    ct = comp.select_one('.comparison-title') if comp else None
    c['comparisonIntro'] = {'eyebrow': 'SIDE-BY-SIDE ITINERARY COMPARISON',
                            'title': txt(ct) if ct else comparison[slug]['title'],
                            'note': txt(comp.select_one('.comparison-subtitle')) if ct else comparison[slug]['note']}
    mp = s.select_one('.coastline-map-section')
    if mp:
        title = mp.select_one('.coastline-main-title')
        c['circuit'] = {
            'eyebrow': txt(mp.select_one('.route-eyebrow')),
            'quote': txt(mp.select_one('.route-quote-text')),
            'quoteCaption': txt(mp.select_one('.route-quote-caption')),
            'title': re.sub(r'\s+', ' ', ''.join(title.find_all(string=True, recursive=False))).strip().rstrip(':') + (':' if ':' in title.get_text() else ''),
            'accent': txt(title.find('span')),
            'leadHtml': clean_html(mp.select_one('.coastline-lead-text')).replace('<p>','').replace('</p>',''),
            'label': txt(mp.select_one('.route-circuit-label')),
            'stops': [txt(x) for x in mp.select('.route-stop-pill')],
            'highlights': [txt(x.find_all('span')[-1]) for x in mp.select('.coastline-highlight-item')],
            'ctaPrimary': txt(mp.select_one('.btn-route-inquire')),
            'ctaWhatsapp': txt(mp.select_one('.btn-route-whatsapp')),
        }
    for sec in s.find_all('section'):
        if sec.select_one('.season-card'):
            c['seasons'] = {**parse_watermark_header(sec), 'cards': [{
                'badge': txt(card.select_one('.season-badge')), 'title': txt(card.select_one('.season-title')),
                'locations': txt(card.select_one('.season-loc')),
                'text': txt(card.select_one('.season-card-body > p')),
                'perks': [{'label': txt(li.find('strong')).rstrip(':'), 'text': txt(li).replace(txt(li.find('strong')), '', 1).strip()} for li in card.select('.season-perks-list li')],
            } for card in sec.select('.season-card')]}
        elif sec.select_one('.ocean-exp-box'):
            c['experiences'] = {**parse_watermark_header(sec), 'items': [{'title': txt(b.find('h4')), 'text': txt(b.find('p'))} for b in sec.select('.ocean-exp-box')]}
        elif sec.select_one('.beach-faq-list .accordion-item'):
            c['faqs'] = {**parse_watermark_header(sec), 'subtitle': '', 'items': [{'q': txt(i.select_one('.accordion-header-btn span')), 'a': txt(i.select_one('.accordion-body'))} for i in sec.select('.accordion-item')]}
        elif 'faq-section' in (sec.get('class') or []) and slug == 'buddhist-heritage':
            hc = sec.select_one('.section-header-center')
            c['faqs'] = {'watermark': txt(hc.select_one('.section-tag')), 'title': txt(hc.find('h2')), 'accent': '', 'subtitle': txt(hc.find('p')),
                         'items': [{'q': txt(i.select_one('.faq-question span')), 'a': txt(i.select_one('.faq-answer'))} for i in sec.select('.faq-item')]}
        elif 'linear-gradient(135deg' in (sec.get('style') or '') and sec.find('h2'):
            btns = [{'label': txt(a), 'href': link(a['href'])} for a in sec.find_all('a', href=True)]
            c['planCta'] = {'eyebrow': txt(sec.find('span')), 'title': txt(sec.find('h2')), 'text': txt(sec.find('p')), 'buttons': btns}
    categories.append(c)

# ---------------------------------------------------------------- package detail pages
packages = []
for slug_cat in CAT_ORDER:
    for d in sorted(os.listdir(os.path.join(SRC, 'tours', slug_cat))):
        p = os.path.join('tours', slug_cat, d, 'index.html')
        if not os.path.isfile(os.path.join(SRC, p)):
            continue
        s = soup(p)
        j = pkg_json.get(d, {})
        hero = s.select_one('.tour-hero-section')
        facts = [{'icon': txt(f.select_one('.tour-fact-icon')), 'label': txt(f.select_one('.tour-fact-label')), 'value': txt(f.select_one('.tour-fact-value'))} for f in s.select('.tour-fact-item')]
        itinerary = []
        for it in s.select('.itinerary-item'):
            pills = [txt(x).replace(txt(x.select_one('.pill-icon')), '', 1).strip() for x in it.select('.itinerary-meta-pill')]
            itinerary.append({'day': txt(it.select_one('.itinerary-day-badge')), 'title': txt(it.select_one('.itinerary-day-title')),
                              'desc': txt(it.select_one('.itinerary-day-desc')), 'meta': [x for x in pills if x]})
        inc = s.select_one('.inclusions-box'); exc = s.select_one('.exclusions-box')
        sb = s.select_one('.tour-sidebar')
        hl = [strip_icon(txt(li)) for li in sb.select('ul li')] if sb else []
        cta = s.select_one('.banner-bottom-cta')
        packages.append({
            'slug': d, 'category': slug_cat, 'id': j.get('id'),
            'metaTitle': txt(s.title), 'metaDescription': (s.find('meta', attrs={'name':'description'}) or {}).get('content',''),
            'title': txt(hero.select_one('.hero-title-main')) if hero else j.get('title'),
            'titleAccent': txt(hero.select_one('.hero-title-accent')) if hero else j.get('titleAccent'),
            'tagline': txt(hero.select_one('.tour-hero-tagline')) if hero else j.get('tagline'),
            'heroBadges': [txt(x) for x in hero.select('.tour-badge-pill')] if hero else [],
            'heroImage': bg_url(hero.get('style')) if hero else '',
            'facts': facts,
            'itineraryIntro': txt(s.select_one('.itinerary-section-sub')),
            'itinerary': itinerary,
            'inclusions': [strip_icon(txt(li)) for li in inc.select('li')] if inc else j.get('inclusions', []),
            'exclusions': [strip_icon(txt(li)) for li in exc.select('li')] if exc else j.get('exclusions', []),
            'price': {'sub': txt(s.select_one('.tour-price-sub')), 'value': txt(s.select_one('.tour-price-val')), 'note': txt(s.select_one('.tour-price-note'))},
            'highlights': hl or j.get('highlights', []),
            'assistance': {'title': txt(s.select_one('.tour-assistance-box h4')), 'text': txt(s.select_one('.tour-assistance-box p'))},
            'relatedTitle': txt(s.select_one('.related-tours-section h2')),
            'relatedEyebrow': txt(s.select_one('.related-tours-section .watermark-heading')),
            'cta': {'eyebrow': txt(cta.select_one('span, .eyebrow')) if cta else '', 'title': txt(cta.find('h2')) if cta else '', 'text': txt(cta.find('p')) if cta else ''},
            # structured extras from packages.json
            'nights': j.get('nights'), 'days': j.get('days'), 'tags': j.get('tags', []), 'route': j.get('route', []),
            'destinations': j.get('destinations', []), 'pace': j.get('pace'), 'difficulty': j.get('difficulty'),
            'bestSeason': j.get('bestSeason'), 'groupSize': j.get('groupSize'), 'childFriendly': j.get('childFriendly'),
            'accessibilityNotes': j.get('accessibilityNotes'), 'badge': j.get('badge'), 'priceNote': j.get('priceNote'),
            'images': [img_path(x) for x in j.get('images', [])],
            'jsonItinerary': j.get('itinerary', []),
        })

# ---------------------------------------------------------------- destinations
s = soup('destinations.html')
destinations = []
filters = [{'key': b.get('data-region'), 'label': txt(b)} for b in s.select('.dest-filter-btn') if b.get('data-region')]
for card in s.select('.dest-card'):
    a = card.select_one('a.dest-card-link') or card.find('a', href=True)
    slug = a['href'].rstrip('/').replace('index.html','').rstrip('/').split('/')[-1]
    destinations.append({
        'slug': slug, 'filter': card.get('data-region'),
        'region': txt(card.select_one('.dest-card-region')), 'title': txt(card.select_one('.dest-card-title')),
        'desc': txt(card.select_one('.dest-card-desc')), 'image': img_path(card.find('img')['src']),
        'highlights': [h.strip() for h in strip_icon(txt(card.select_one('.dest-card-highlights'))).split('·')],
    })
for d in destinations:
    ds = soup(f'destinations/{d["slug"]}/index.html')
    hero = ds.select_one('.destination-detail-hero')
    d['metaTitle'] = txt(ds.title)
    d['metaDescription'] = (ds.find('meta', attrs={'name':'description'}) or {}).get('content','')
    d['heroImage'] = bg_url(hero.get('style')) if hero else d['image']
    d['badge'] = txt(hero.select_one('.badge')) if hero else d['region']
    body = hero.find_next('section')
    h2 = body.find('h2'); d['essenceTitle'] = txt(h2)
    d['essence'] = txt(h2.find_next('p')) if h2 else ''
    h3s = body.find_all('h3')
    d['experiencesTitle'] = txt(h3s[0]) if h3s else ''
    d['planTitle'] = txt(h3s[1]) if len(h3s) > 1 else ''
    d['planText'] = txt(h3s[1].find_next('p')) if len(h3s) > 1 else ''
    btn = body.find('a', href=re.compile('inquiry'))
    d['planButton'] = txt(btn).replace('➔','').strip() if btn else ''
    d['planEyebrow'] = 'Tailor-Made Journey'
s_head = s.select_one('.dest-hero')
dest_page = {
    'badge': txt(s_head.select_one('.sacred-badge-tag')).replace('🌸','').replace('✦','').strip(),
    'title': 'Explore Sri Lanka\'s', 'accent': 'Sacred Sites & Famous Destinations',
    'lead': txt(s_head.find('p', class_=re.compile('paragraph'))),
    'filters': filters,
    'searchPlaceholder': (s.select_one('.dest-search-input') or {}).get('placeholder', 'Search destinations...'),
}

# ---------------------------------------------------------------- blog
blog_meta = {b['slug']: b for b in json.load(open(os.path.join(SRC, 'data/blog.json')))}
seed = json.load(open(os.path.join(SRC, 'data/seed-catalog.json')))
for b in seed.get('blog', []):
    blog_meta.setdefault(b['slug'], b)
bl = soup('blog.html')
blog = []
for card in bl.select('.blog-card'):
    a = card.find('a', href=True)
    slug = a['href'].rstrip('/').split('/')[-1]
    meta = blog_meta.get(slug, {})
    bs = soup(f'blog/{slug}/index.html')
    main = bs.find('article') or bs.find('main')
    h1 = bs.find('h1')
    # article body: everything after the hero inside the article
    body_el = bs.select_one('.article-body, .blog-article-body, .post-content, .article-content') or main
    blog.append({
        'slug': slug, 'title': txt(h1), 'metaTitle': txt(bs.title),
        'metaDescription': (bs.find('meta', attrs={'name':'description'}) or {}).get('content',''),
        'category': meta.get('category') or txt(card.find(class_=re.compile('cat'))),
        'readTime': meta.get('readTime'), 'date': meta.get('date'), 'author': meta.get('author'),
        'cover': img_path(card.find('img')['src']),
        'excerpt': txt(card.find('p')),
        'cardRating': txt(card.find(string=re.compile('★'))) if card.find(string=re.compile('★')) else '',
        'cardPrice': txt(card.find(string=re.compile(r'From \$'))) if card.find(string=re.compile(r'From \$')) else '',
        'rawBodyHtml': clean_html(body_el),
    })

def split_blog(b):
    raw = b['rawBodyHtml']
    by = re.search(r'<p> ?By (.*?)</p>', raw)
    b['byline'] = re.sub(r'<[^>]+>', '', by.group(1)).strip() if by else ''
    i = raw.find('/>', raw.find('<img')) + 2
    body = raw[i:]
    activity = None
    if 'Check availability' in body:
        head, body = body.split('Check availability', 1)
        body = body.split('</a>', 1)[1]
        head_txt = re.sub(r'<!--.*?-->', '', head)
        h3 = re.search(r'<h3>(.*?)</h3>', head_txt).group(1).strip()
        p = re.search(r'<p>(.*?)</p>', head_txt).group(1).strip()
        activity = {'rating': '4.9', 'reviews': '100 reviews', 'badge': 'Instant Confirmation', 'title': h3, 'text': p,
                    'calloutTitle': 'Loved by English speakers', 'calloutText': '100% of English-speaking travelers gave this activity a perfect score',
                    'priceFrom': '$10', 'priceUnit': 'per person', 'cta': 'Check availability', 'href': '/inquiry?tour=ella-tea-making'}
    links = re.findall(r'<a href="([^"]+)">(.*?)</a>', body[body.rfind('</p>'):])
    body = body[:body.rfind('</p>') + 4] if links else body
    body = re.sub(r'<!--.*?-->', '', body)
    body = re.sub(r'<p> ?“(.*?)” ?</p>', r'<blockquote><p>“\1”</p></blockquote>', body)
    body = re.sub(r'\s*(</?(?:p|h2|h3|h4|ul|ol|li|blockquote)>)\s*', r'\1', body)
    b['bodyHtml'] = body.strip()
    b['activity'] = activity
    b['footerLinks'] = [{'href': h, 'label': re.sub(r'\s+', ' ', l).strip()} for h, l in links]
    del b['rawBodyHtml']
for b in blog:
    split_blog(b)

# ---------------------------------------------------------------- legal pages
legal = {}
for f in ['privacy-policy', 'terms-conditions', 'cancellation-policy', 'cookie-policy']:
    ls = soup(f + '.html')
    hero = ls.select_one('.legal-hero')
    card = ls.select_one('.legal-card')
    disc = ls.select_one('.legal-disclaimer-box')
    if disc:
        disc_html = clean_html(disc); disc.decompose()
    else:
        disc_html = ''
    legal[f] = {
        'metaTitle': txt(ls.title), 'metaDescription': (ls.find('meta', attrs={'name':'description'}) or {}).get('content',''),
        'badge': txt(hero.select_one('.legal-badge')), 'title': txt(hero.find('h1')),
        'paragraphs': [txt(p) for p in hero.find_all('p')],
        'disclaimerHtml': disc_html, 'bodyHtml': clean_html(card),
    }

# ---------------------------------------------------------------- gallery
gs = soup('gallery.html')
gallery = {'filters': [{'key': b.get('data-cat'), 'label': txt(b)} for b in gs.select('.dest-filter-btn')], 'items': [{
    'filter': g.get('data-cat'),
    'image': img_path(g.find('img')['src']), 'alt': g.find('img').get('alt',''),
    'tag': txt(g.select_one('.gallery-tag')), 'title': txt(g.select_one('.gallery-title')),
    'desc': txt(g.select_one('.gallery-desc')), 'location': txt(g.select_one('.gallery-location')).lstrip('📍 ').strip(),
} for g in gs.select('.gallery-card')]}

# ---------------------------------------------------------------- experiences encounters
es = soup('experiences.html')
def head_block(sec):
    d = sec.select_one('.wrapper--90 > div, .wrapper--80 > div')
    return {'eyebrow': txt(d.find('span')), 'title': txt(d.find('h2')), 'text': txt(d.find('p'))}
grid = es.select_one('#encountersGrid')
encounters = []
for card in grid.select('article.exp-item-card'):
    encounters.append({'filter': card.get('data-cat'), 'image': img_path(card.find('img')['src']), 'alt': card.find('img').get('alt',''),
                       'tag': txt(card.select_one('.dest-card-region')), 'title': txt(card.find('h3')),
                       'text': txt(card.select_one('.dest-card-desc')), 'meta': txt(card.select_one('.exp-item-body > div'))})
bp = es.select_one('#brandsPillars')
pillars = []
for art in bp.select('article.brand-pillar-card'):
    body = art.select_one('.brand-pillar-body')
    divs = body.find_all('div', recursive=False)
    lk = body.find('a', href=True)
    pillars.append({'id': art.get('id'), 'image': img_path(art.find('img')['src']), 'alt': art.find('img').get('alt',''),
                    'icon': txt(divs[0].find_all('span')[0]), 'kicker': txt(divs[0].find_all('span')[-1]),
                    'title': txt(body.find('h3')), 'text': txt(body.find('p')),
                    'tags': [strip_icon(txt(x)) for x in divs[1].find_all('span')] if len(divs) > 1 else [],
                    'cta': txt(lk).replace('➔','').strip(), 'href': link(lk['href'])})
eh = es.select_one('.exp-hero')
plan = [sec for sec in es.find_all('section') if sec.find('h2') and 'Weave These' in txt(sec.find('h2'))]
experiences = {'hero': {'badge': txt(eh.select_one('.sacred-badge-tag')).replace('🌸','').replace('✦','').strip(),
                        'title': txt(eh.find('h1').find('span')), 'accent': 'Handcrafted Ceylon Encounters', 'lead': txt(eh.find('p'))},
               'pillarsHead': head_block(bp), 'pillars': pillars,
               'encountersHead': head_block(grid), 'filters': [{'key': b.get('data-cat'), 'label': txt(b)} for b in grid.select('.dest-filter-btn')], 'encounters': encounters,
               'plan': {'eyebrow': 'Artisanal Itinerary Planning', 'title': txt(plan[0].find('h2')) if plan else '', 'text': txt(plan[0].find('h2').find_next('p')) if plan else ''}}

# ---------------------------------------------------------------- settings + team + faqs
settings = seed['settings'][0]
team = json.load(open(os.path.join(SRC, 'data/team.json')))

def dump(name, obj):
    with open(os.path.join(OUT, name), 'w', encoding='utf8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)

dump('categories.json', categories)
# ---- repair legacy detail pages that were stubs or copies of another package
def en(v):
    return v.get('en', '') if isinstance(v, dict) else (v or '')

card_by_slug = {c['slug']: c for cat in categories for c in cat['packagesSection']['cards']}
for p_ in packages:
    j = pkg_json.get(p_['slug'], {})
    card = card_by_slug.get(p_['slug'], {})
    html_title_ok = p_['title'] == en(j.get('title'))
    json_days = len(j.get('itinerary', []))
    if j and (not html_title_ok or json_days > len(p_['itinerary'])):
        p_['title'] = en(j.get('title')) or p_['title']
        p_['titleAccent'] = j.get('titleAccent') or j.get('subtitle') or ('' if not html_title_ok else p_['titleAccent'])
        p_['tagline'] = j.get('tagline') or en(j.get('overview')) or p_['tagline']
        p_['itinerary'] = [{
            'day': f"Day {d['day']}",
            'title': d.get('title', ''),
            'desc': d.get('description') or d.get('desc', ''),
            'meta': [x for x in [
                f"Overnight: {d['overnight']}" if d.get('overnight') else (f"Overnight: {d['stay']}" if d.get('stay') else ''),
                d.get('meals', ''),
            ] if x],
        } for d in j['itinerary']]
        p_['highlights'] = j.get('highlights') or p_['highlights']
        if len(j.get('inclusions', [])) >= len(p_['inclusions']) or not html_title_ok:
            p_['inclusions'] = j.get('inclusions', p_['inclusions'])
        if len(j.get('exclusions', [])) >= len(p_['exclusions']) or not html_title_ok:
            p_['exclusions'] = j.get('exclusions', p_['exclusions'])
        if j.get('bestSeason'):
            p_['bestSeason'] = j['bestSeason']
            p_['facts'] = [dict(f, value=j['bestSeason']) if f['label'] == 'Best Season' else f for f in p_['facts']]
        if j.get('faqs'):
            p_['faqs'] = j['faqs']
        if not html_title_ok and (j.get('images') or j.get('hero_image')):
            p_['heroImage'] = img_path((j.get('images') or [j.get('hero_image')])[0])
        p_['metaTitle'] = f"{p_['title']} | Lotus Ceylon"
        p_['relatedTitle'] = p_['relatedTitle']
        p_['cta']['title'] = f"Ready to Experience {p_['title']}?"
    # durations always follow the itinerary actually shown
    n = len(p_['itinerary'])
    if n and p_['days'] != n:
        p_['days'], p_['nights'] = n, n - 1
    if card.get('price') and 'From' in card['price']:
        p_['price']['value'] = card['price'].replace('From', 'From ').replace('  ', ' ').strip()

PUBLIC = os.path.join(os.path.dirname(os.path.abspath(OUT.rstrip('/'))), '..', 'public')
for p_ in packages:
    p_['images'] = [i for i in p_['images'] if os.path.exists(os.path.join(PUBLIC, i.lstrip('/')))]
dump('packages.json', packages)
dump('comparison.json', comparison)
dump('destinations.json', {'page': dest_page, 'items': destinations})
dump('blog.json', blog)
dump('legal.json', legal)
dump('gallery.json', gallery)
dump('experiences.json', experiences)
dump('settings.json', {'settings': settings, 'team': team, 'faqs': seed.get('faqs', [])})
print('categories', len(categories), 'packages', len(packages), 'destinations', len(destinations), 'blog', len(blog),
      'legal', len(legal), 'gallery', len(gallery['items']), 'encounters', len(encounters), 'pillars', len(pillars))
