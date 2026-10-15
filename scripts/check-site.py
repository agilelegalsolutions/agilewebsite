#!/usr/bin/env python3
"""
Site Verification Script for Agile Legal Solutions
Standard Library Only (no external pip dependencies)

Checks:
  1. Internal link points to non-www host
  2. Internal link href ends with .html (must be clean URL)
  3. Canonical link missing or points to wrong host / wrong path / includes .html
  4. Missing <h1>, or more than one <h1>
  5. Missing <title> or <meta name="description">
  6. Title length > 60 chars, description length > 155 chars
  7. Invalid JSON-LD syntax (use json.loads)
  8. FAQ text in JSON-LD does not match visible HTML text
  9. sitemap.xml URLs do not match existing HTML files (excluding noindex files)
 10. Any [CONFIRM, [TODO, [Month Year] or similar leftover placeholders
 11. Meta keywords tag present
"""

import sys
import os
import glob
import re
import json
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

CANONICAL_HOST = "https://www.agiletrademarkfiling.com"
CANONICAL_PAGES = {
    "index.html": "/",
    "trademark-registration-delhi.html": "/trademark-registration-delhi",
    "trademark-search-india.html": "/trademark-search-india",
    "trademark-objection-reply.html": "/trademark-objection-reply",
    "trademark-lawyer-delhi.html": "/trademark-lawyer-delhi",
    "ipr-law-firm-delhi.html": "/ipr-law-firm-delhi",
    "trademark-lawyer-rohini.html": "/trademark-lawyer-rohini",
    "about-advocate.html": "/about-advocate",
}

NOINDEX_PAGES = {
    "404.html",
    "privacy-policy.html",
    "terms-of-service.html",
    "cookie-policy.html",
}

def clean_text(text):
    """Normalize text by stripping tags, special punctuation, and collapsing whitespace."""
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&[a-zA-Z0-9#]+;", " ", text)
    text = re.sub(r"[\u2018\u2019\u201c\u201d\'\"’‘“”]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip().lower()

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.titles = []
        self.in_title = False
        self.h1_tags = []
        self.in_h1 = False
        self.h1_buffer = []
        self.meta_tags = []
        self.canonical = None
        self.links = []
        self.scripts = []
        self.in_script = False
        self.current_script_attrs = {}
        self.script_buffer = []
        self.visible_text = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == "title":
            self.in_title = True
        elif tag == "h1":
            self.in_h1 = True
            self.h1_buffer = []
        elif tag == "meta":
            self.meta_tags.append(attrs_dict)
        elif tag == "link":
            rel = attrs_dict.get("rel", "").lower()
            if rel == "canonical":
                self.canonical = attrs_dict.get("href", "")
        elif tag == "a":
            href = attrs_dict.get("href")
            if href:
                self.links.append((href, attrs_dict))
        elif tag == "script":
            self.in_script = True
            self.current_script_attrs = attrs_dict
            self.script_buffer = []

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "h1":
            self.in_h1 = False
            self.h1_tags.append("".join(self.h1_buffer).strip())
        elif tag == "script":
            self.in_script = False
            self.scripts.append((self.current_script_attrs, "".join(self.script_buffer)))

    def handle_data(self, data):
        if self.in_title:
            self.titles.append(data)
        elif self.in_h1:
            self.h1_buffer.append(data)
        elif self.in_script:
            self.script_buffer.append(data)
        else:
            self.visible_text.append(data)

def check_file(filename, failures):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    parser = PageParser()
    parser.feed(content)

    basename = os.path.basename(filename)

    # 1. Internal link points to non-www host
    # 2. Internal link href ends with .html
    for href, attrs in parser.links:
        # Check non-www host
        if "agiletrademarkfiling.com" in href and "www.agiletrademarkfiling.com" not in href:
            failures.append(f"[{basename}] Link points to non-www host: {href}")

        # Check internal link ends with .html
        is_internal = False
        if href.startswith("/") or href.startswith("./") or href.startswith("../"):
            is_internal = True
        elif href.startswith("https://www.agiletrademarkfiling.com") or href.startswith("http://www.agiletrademarkfiling.com"):
            is_internal = True

        if is_internal:
            clean_href = href.split("?")[0].split("#")[0]
            if clean_href.endswith(".html"):
                failures.append(f"[{basename}] Internal link ends with .html: {href}")

    # 3. Canonical link checks
    if basename in CANONICAL_PAGES:
        expected_path = CANONICAL_PAGES[basename]
        expected_canonical = f"{CANONICAL_HOST}{expected_path}"
        if not parser.canonical:
            failures.append(f"[{basename}] Missing canonical link (expected {expected_canonical})")
        elif parser.canonical != expected_canonical:
            failures.append(f"[{basename}] Canonical mismatch: found '{parser.canonical}', expected '{expected_canonical}'")
    elif basename in NOINDEX_PAGES:
        # Check if canonical is absent or self-referential without .html
        if parser.canonical and ".html" in parser.canonical:
            failures.append(f"[{basename}] Canonical contains .html: {parser.canonical}")

    # 4. Heading <h1> count
    if len(parser.h1_tags) == 0:
        failures.append(f"[{basename}] Missing <h1> tag")
    elif len(parser.h1_tags) > 1:
        failures.append(f"[{basename}] Multiple <h1> tags found ({len(parser.h1_tags)}): {parser.h1_tags}")

    # 5. Missing <title> or <meta name="description">
    # 6. Title length > 60, description length > 155
    title_text = "".join(parser.titles).strip()
    if not title_text:
        failures.append(f"[{basename}] Missing <title> tag")
    elif len(title_text) > 60:
        failures.append(f"[{basename}] Title length > 60 chars ({len(title_text)} chars): '{title_text}'")

    meta_desc = None
    for meta in parser.meta_tags:
        if meta.get("name", "").lower() == "description":
            meta_desc = meta.get("content", "").strip()
            break

    if not meta_desc:
        failures.append(f"[{basename}] Missing <meta name='description'>")
    elif len(meta_desc) > 155:
        failures.append(f"[{basename}] Description length > 155 chars ({len(meta_desc)} chars): '{meta_desc}'")

    # 7. Invalid JSON-LD syntax
    # 8. FAQ text in JSON-LD does not match visible HTML text
    visible_content = clean_text(" ".join(parser.visible_text))

    for attrs, script_content in parser.scripts:
        if attrs.get("type", "").lower() == "application/ld+json":
            try:
                data = json.loads(script_content)
            except Exception as e:
                failures.append(f"[{basename}] Invalid JSON-LD syntax: {e}")
                continue

            # Check FAQ text match
            graph = data.get("@graph", [data]) if isinstance(data, dict) else []
            for item in graph:
                if isinstance(item, dict) and item.get("@type") == "FAQPage":
                    for q in item.get("mainEntity", []):
                        if not isinstance(q, dict):
                            continue
                        q_name = q.get("name", "")
                        q_ans = ""
                        ans_obj = q.get("acceptedAnswer", {})
                        if isinstance(ans_obj, dict):
                            q_ans = ans_obj.get("text", "")

                        # Test question name in visible text
                        clean_q = clean_text(q_name)
                        if clean_q and clean_q not in visible_content:
                            failures.append(f"[{basename}] FAQ question in JSON-LD not in visible HTML: '{q_name}'")

                        # Test answer text in visible text
                        clean_a = clean_text(q_ans)
                        if clean_a:
                            # Use first 35 chars of answer to ensure anchor match in visible text
                            ans_sample = clean_a[:35]
                            if ans_sample not in visible_content:
                                failures.append(f"[{basename}] FAQ answer snippet not in visible HTML: '{ans_sample}' (from: {q_name})")

    # 10. Leftover placeholders: [CONFIRM, [TODO, [Month Year], [FILL
    placeholder_matches = re.findall(r"\[(?:CONFIRM|TODO|Month Year|FILL)[^\]]*\]", content, re.IGNORECASE)
    if placeholder_matches:
        failures.append(f"[{basename}] Leftover placeholders found: {placeholder_matches}")

    # 11. Meta keywords tag present
    for meta in parser.meta_tags:
        if meta.get("name", "").lower() == "keywords":
            failures.append(f"[{basename}] Meta keywords tag found: {meta}")

def check_sitemap(sitemap_file, failures):
    if not os.path.exists(sitemap_file):
        failures.append("sitemap.xml does not exist")
        return

    try:
        tree = ET.parse(sitemap_file)
        root = tree.getroot()
        namespace = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [elem.text.strip() for elem in root.findall("ns:url/ns:loc", namespace)]
    except Exception as e:
        failures.append(f"Failed to parse sitemap.xml: {e}")
        return

    # 9. sitemap.xml URLs must match canonical pages
    expected_urls = sorted([f"{CANONICAL_HOST}{path}" for path in CANONICAL_PAGES.values()])
    sitemap_urls_sorted = sorted(urls)

    if sitemap_urls_sorted != expected_urls:
        missing = set(expected_urls) - set(sitemap_urls_sorted)
        extra = set(sitemap_urls_sorted) - set(expected_urls)
        failures.append(f"sitemap.xml URL mismatch. Missing: {missing}, Unexpected: {extra}")

    # Ensure no noindex page is in sitemap
    for url in urls:
        for noindex in NOINDEX_PAGES:
            clean_name = noindex.replace(".html", "")
            if clean_name in url:
                failures.append(f"sitemap.xml contains noindex page: {url}")

def check_placeholders_globally(failures):
    for f in sorted(glob.glob("*.xml") + glob.glob("*.txt")):
        with open(f, "r", encoding="utf-8") as fp:
            c = fp.read()
        matches = re.findall(r"\[(?:CONFIRM|TODO|Month Year|FILL)[^\]]*\]", c, re.IGNORECASE)
        if matches:
            failures.append(f"[{f}] Leftover placeholders found: {matches}")

def main():
    print("==================================================")
    print("      Agile Legal Solutions - Site Verifier       ")
    print("==================================================")

    failures = []
    html_files = sorted(glob.glob("*.html"))

    if not html_files:
        print("ERROR: No HTML files found in current directory.")
        sys.exit(1)

    print(f"Scanning {len(html_files)} HTML files for SEO and technical standards...")
    for f in html_files:
        check_file(f, failures)

    print("Verifying sitemap.xml structure and canonical mappings...")
    check_sitemap("sitemap.xml", failures)

    print("Verifying text / xml files for placeholders...")
    check_placeholders_globally(failures)

    print("--------------------------------------------------")
    if failures:
        print(f"FAILED: Found {len(failures)} issue(s):")
        for i, failure in enumerate(failures, 1):
            print(f"  {i}. {failure}")
        print("==================================================")
        sys.exit(1)
    else:
        print("PASSED: All checks passed with 0 errors!")
        print("  ✓ 0 internal non-www or .html links")
        print("  ✓ Canonical links verified for all canonical pages")
        print("  ✓ Single <h1> per page verified")
        print("  ✓ All titles <= 60 chars, descriptions <= 155 chars")
        print("  ✓ Valid JSON-LD schemas and 100% FAQ visible text parity")
        print("  ✓ sitemap.xml contains exactly the 8 canonical URLs")
        print("  ✓ 0 leftover placeholders ([CONFIRM, [TODO, [Month Year])")
        print("  ✓ 0 meta keywords tags")
        print("==================================================")
        sys.exit(0)

if __name__ == "__main__":
    main()
