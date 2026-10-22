#!/usr/bin/env python3
"""Build a static, safe, search-friendly blog for GitHub Pages from Pages CMS Markdown.

Usage:
  python scripts/build_blog.py --output _site
  python scripts/build_blog.py --output .    # local build into working tree

The builder does not require a database or expose a GitHub access token to visitors.
"""
import argparse
import datetime as dt
import html
import json
import re
import shutil
from pathlib import Path
from urllib.parse import urlparse

import bleach
import yaml
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = {'Paper Review', 'Research Insights', 'Lab Stories', 'Projects', 'Statistics', 'Uncategorized', '기타', 'Technical Notes', 'Tutorials'}
MARKDOWN = MarkdownIt('commonmark', {"html": False, "linkify": False}).enable('table')
ALLOWED_TAGS = {
    'p','h1','h2','h3','h4','h5','h6','strong','em','a','img','blockquote','pre','code',
    'br','hr','ul','ol','li','table','thead','tbody','tr','th','td','del','s','sup','sub'
}
ALLOWED_ATTRS = {'a':['href','title'], 'img':['src','alt','title','loading'], 'th':['align'], 'td':['align']}
SAFE_IMAGE = re.compile(r'^(?:assets/img/blog/|https://)', re.I)
SAFE_SLUG = re.compile(r'^[a-z0-9][a-z0-9_-]*$')


def safe_image(value):
    value = str(value or '').strip().lstrip('/')
    if not value or value.startswith(('http://', 'javascript:', 'data:')):
        return ''
    # Hosted external images are deliberately disallowed; Pages CMS media lives in our repo.
    if not value.startswith('assets/img/blog/') or '..' in value or '\\' in value:
        return ''
    return value if value.lower().endswith(('.jpg','.jpeg','.png','.webp','.gif','.svg')) else ''


def parsed_post(path):
    raw = path.read_text(encoding='utf-8')
    match = re.match(r'\A---\s*\n(.*?)\n---\s*\n(.*)\Z', raw, flags=re.S)
    if not match:
        raise ValueError(f'{path}: YAML front matter is required')
    meta = yaml.safe_load(match.group(1))
    if not isinstance(meta, dict):
        raise ValueError(f'{path}: invalid front matter')
    if not isinstance(meta.get('published'), bool) or meta['published'] is not True:
        return None
    title = str(meta.get('title','')).strip()
    if not title:
        raise ValueError(f'{path}: missing title')
    slug = path.stem
    if not SAFE_SLUG.fullmatch(slug):
        raise ValueError(f'{path}: filename must use lowercase Latin slug with dashes')
    date = meta.get('date')
    if isinstance(date, (dt.datetime,dt.date)):
        date = date.date().isoformat() if isinstance(date,dt.datetime) else date.isoformat()
    date = str(date or '')[:10]
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', date):
        raise ValueError(f'{path}: date must be YYYY-MM-DD')
    dt.date.fromisoformat(date)
    category = str(meta.get('category','Lab Stories')).strip()
    if category not in CATEGORIES:
        category = 'Lab Stories'
    language = str(meta.get('language','en')).strip()
    if language not in ('en','ko'):
        language = 'en'
    author = str(meta.get('author','AI Stat Lab')).strip()[:120]
    summary = str(meta.get('summary','')).strip()[:360]
    cover = safe_image(meta.get('cover',''))
    # Preserve markdown for rich-text; HTML source is escaped and sanitized.
    body_html = MARKDOWN.render(match.group(2))
    body_html = bleach.clean(body_html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS,
                             protocols=['https','http','mailto'], strip=True)
    # Aligns and images from CMS are set to relative folder references.
    return {"slug":slug,"title":title,"date":date,"author":author,
            "category":category,"language":language,"summary":summary,
            "cover":cover,"html":body_html}


def article_html(post):
    E = lambda val: html.escape(str(val), quote=True)
    cover = (f'<img class="article-cover" src="{E(post["cover"])}" alt="" loading="eager">'
             if post['cover'] else '')
    lang = post['language']
    back = '← 블로그 목록' if lang == 'ko' else '← Back to blog'
    lab = '중앙대학교 · AI Stat Lab' if lang == 'ko' else 'Chung-Ang University · AI Stat Lab'
    return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base href="../../">
<meta name="description" content="{E(post['summary'])}">
<meta property="og:type" content="article"><meta property="og:title" content="{E(post['title'])}">
<meta property="og:description" content="{E(post['summary'])}">
<title>{E(post['title'])} | AI Stat Lab</title>
<link rel="icon" href="assets/img/favicon.png"><link rel="stylesheet" href="assets/style.css"><link rel="stylesheet" href="assets/blog.css">
</head><body class="article-page">
<header class="article-topbar"><div class="shell article-topbar-inner"><a href="./#home" class="article-logo" aria-label="AI Stat Lab home"><img src="assets/img/ai-stat-lab-full-logo.png" alt="AI Stat Lab"></a><a class="article-back" href="./#blog">{back}</a></div></header>
<main class="article-main"><article class="shell article-container">
<a href="./#blog" class="article-breadcrumb">BLOG / {E(post['category'])}</a>
<div class="article-meta"><time datetime="{E(post['date'])}">{E(post['date'])}</time><span>·</span><span>{E(post['author'])}</span><span>·</span><span>{'한국어' if lang=='ko' else 'English'}</span></div>
<h1>{E(post['title'])}</h1>
<p class="article-lead">{E(post['summary'])}</p>
{cover}
<div class="blog-prose">{post['html']}</div>
<div class="article-end"><a href="./#blog">{back} ↗</a><span>{lab}</span></div>
</article></main>
<footer class="footer"><div class="shell article-footer">Artificial Intelligence &amp; Statistics Lab · Chung-Ang University</div></footer>
<script src="assets/article-math.js" defer></script>
</body></html>
'''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--output', default='_site')
    args = ap.parse_args()
    output = (ROOT / args.output).resolve() if not Path(args.output).is_absolute() else Path(args.output)
    if output != ROOT:
        if output.exists():
            shutil.rmtree(output)
        output.mkdir(parents=True)
        ignore = shutil.ignore_patterns('.git','.github','_site','scripts','content','*.zip',
                                        'requirements-blog.txt','.pages.yml','README.md',
                                        '*Preview*.html','check-index.png','qa-light.html')
        shutil.copytree(ROOT, output, dirs_exist_ok=True, ignore=ignore)
    posts = []
    for file in sorted((ROOT/'content'/'blog').glob('*.md')):
        post = parsed_post(file)
        if post is not None:
            posts.append(post)
    posts.sort(key=lambda p:(p['date'],p['slug']),reverse=True)
    js_payload = [{key: p[key] for key in ('slug','title','date','author','category','language','summary','cover')} for p in posts]
    (output/'data').mkdir(parents=True,exist_ok=True)
    # Avoid leaking private drafts. Index contains only published metadata.
    (output/'data/blog-index.js').write_text('window.AISTAT_BLOG = '+json.dumps(js_payload,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    blogroot=output/'blog'
    if output != ROOT and blogroot.exists():
        shutil.rmtree(blogroot)  # avoid retaining a page for a deleted/unpublished post
    blogroot.mkdir(parents=True,exist_ok=True)
    for post in posts:
        page_dir=blogroot/post['slug']
        page_dir.mkdir(parents=True,exist_ok=True)
        (page_dir/'index.html').write_text(article_html(post),encoding='utf-8')
    # ensure Jekyll cannot interfere with the static assets.
    (output/'.nojekyll').touch()
    print(f'Built {len(posts)} published blog posts -> {output}')

if __name__ == '__main__':
    main()
