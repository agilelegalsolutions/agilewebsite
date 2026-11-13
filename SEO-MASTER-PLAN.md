# Agile Legal Solutions® — Master SEO & Content Architecture Plan
**Domain:** `https://www.agiletrademarkfiling.com`  
**Practice Heritage:** Established 2017 | Led by Advocate Arun Kumar Jha (Delhi High Court & Trade Marks Registry, Dwarka)  
**Main Chambers:** 2nd Floor, Garg Trade Center (G3S Mall), Sector 11, Rohini, New Delhi 110085  
**Google Business Profile (GBP):** Agile Legal Solutions - Trademark & Patent Attorney (4.9 ★★★★★ | 47 Google Reviews)  
**Last Updated:** November 13, 2026

---

## 1. Executive Summary & GSC Analysis

### 1.1 The Indexing Diagnosis (Debunking the "Not Indexed" Myth)
* **GSC Status:** Google **has indexed all primary service pages**.
* **Discovered – currently not indexed:** **0 pages** (Passed).
* **The 4 "Not Indexed" Entries:**
  1. *2 Redirect errors:* Caused by legacy apex `agiletrademarkfiling.com` / `agileipr.com` / `.html` redirect chains.
  2. *1 Page with redirect:* Normal 301 redirect recorded when Google crawls an old migration URL.
  3. *1 Alternate page with proper canonical tag:* Google crawled a `.html` or duplicate URL and correctly recognized the canonical tag.
* **The Real Issue:** A **Ranking & Search Intent Gap**, not an indexing failure. Key pages ranked on Pages 4–8 due to keyword cannibalization, lack of review rich snippets, and a thin 8-page footprint compared to 100+ page competitors.

---

## 2. Completed SEO Activities (Sprint 1 — Nov 13, 2026)

### Activity 1: Google Business Profile & Review Schema Synchronization (Priority #1)
* **Status:** COMPLETED across all HTML pages.
* **Technical Implementation:**
  * Injected `aggregateRating` into `@type: LegalService` (#firm) across the entire site:
    * `ratingValue: "4.9"`
    * `reviewCount: "47"`
    * `priceRange: "₹₹"`
    * Exact business name match: `"Agile Legal Solutions - Trademark & Patent Attorney"`
  * Injected visible trust badge in heroes: `★★★★★ 4.9 / 5.0 • 47 Google Reviews` with direct link to Google Maps listing.
  * Updated all footer citation texts from outdated "43 reviews" to "47 reviews (as of November 2026)".

### Activity 2: Keyword Cannibalization Resolution (Priority #2)
* **Status:** COMPLETED.
* **Separated Search Intent:**
  * **Homepage (`/`):** Firm brand identity & central IP authority hub.
  * **`/trademark-registration-delhi`:** Commercial filing, Form TM-A process, statutory fees (₹4,500 / ₹9,000), documents.
  * **`/trademark-lawyer-delhi`:** Hearings, opposition advocacy, and litigation before Dwarka Registry & Delhi High Court.
  * **`/ipr-law-firm-delhi`:** Full-spectrum corporate IP (Patents, Copyrights, Designs, IP audits).
  * **`/trademark-lawyer-rohini`:** Hyper-local Rohini chamber practice (Sector 11, G3S Mall, Sector 16, Pitampura, NSP).

### Activity 3: Objection Page Deepening (Priority #3)
* **Status:** COMPLETED on `/trademark-objection-reply`.
* **Additions:**
  * Section 9(1) Proviso & Acquired Distinctiveness defense (Rule 25 user evidence affidavits, CA turnover certificates).
  * Section 11(1) Anti-Dissection doctrine & phonetic/visual comparison tests (Delhi High Court precedents).
  * Contextual link to hearing guide for unresolved objections.

### Activity 4: High-Traffic Competitor Pages Added (Priority #4 — Batch 1)
* **Status:** COMPLETED.
* **New Page A:** `/trademark-hearing-delhi` (Dwarka Registry show-cause hearing procedure, Cisco Webex, Form TM-M).
* **New Page B:** `/trademark-class-35-delhi` (Retail, wholesale trading, e-commerce, and commercial services).
* **Integration:** Added to `sitemap.xml`, `llms.txt`, `llm.txt`, and footer links across all pages.

### Activity 5: Technical Redirect Chain Elimination (Priority #5)
* **Status:** COMPLETED in `.htaccess`.
* **Fix:** Added direct single-hop trailing slash stripping (`RewriteCond %{REQUEST_URI} ^/(.+)/$` -> `/%1 [R=301,L]`) to prevent multi-hop redirect loops.

---

## 3. The 6-Week Publishing Calendar (2 Pages / Week)

To match competitor topical authority and dominate both Google Search and Generative AI (ChatGPT, Perplexity, Gemini), pages are published at a cadence of **2 pages per week**, prioritized by search volume and commercial intent.

```
┌────────┬──────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Week   │ Target Pages                     │ Strategic Focus & Search Queries                       │
├────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Week 1 │ 1. /trademark-status-guide       │ High-volume top-of-funnel queries: "objected",         │
│ (Now)  │ 2. /trademark-class-25-delhi     │ "vienna codification", plus Delhi's garment industry   │
├────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Week 2 │ 3. /trademark-opposition-delhi   │ High-ticket adversarial litigation: Form TM-O defense  │
│        │ 4. /trademark-class-42-delhi     │ Software, SaaS, IT startups in Delhi NCR / Gurugram    │
├────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Week 3 │ 5. /trademark-class-5-delhi      │ Pharmaceuticals & Ayurvedic similarity defense         │
│        │ 6. /trademark-renewal-delhi      │ 10-year recurring renewal fees & restoration           │
├────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Week 4 │ 7. /trademark-class-43-delhi     │ Restaurants, cafes & cloud kitchens across Delhi NCR   │
│        │ 8. /trademark-assignment-delhi   │ Brand sales, licensing, mergers & transfers (Form TM-P)│
├────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Week 5 │ 9. /copyright-registration-delhi │ Logo copyright NOC (Rule 45) & artistic works          │
│        │ 10. /trademark-class-9-delhi     │ Electronics, electrical devices, mobile apps           │
├────────┼──────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Week 6 │ 11. /trademark-rectification-delhi│ Removing dead/abandoned marks from the Register        │
│        │ 12. /trademark-litigation-delhi  │ Infringement, passing off, Delhi High Court IPD suits  │
└────────┴──────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 4. Technical Standards Checklist (For Every New Page)

Every page created must adhere to the standard library test suite (`scripts/check-site.py`):
1. **URL Structure:** Clean extensionless URLs only (e.g., `/trademark-status-guide`, never `.html`).
2. **Canonical Tag:** `<link rel="canonical" href="https://www.agiletrademarkfiling.com/<slug>">`.
3. **Title Tag:** Exactly `<= 60 characters`.
4. **Meta Description:** Exactly `<= 155 characters`.
5. **Headings:** Exactly one `<h1>` per page.
6. **Schema (JSON-LD):**
   * `@type: LegalService` with exact `#firm` ID, name, and `aggregateRating` (4.9 / 47 reviews).
   * `@type: BreadcrumbList`
   * `@type: FAQPage` with **100% word-for-word parity** between JSON-LD and visible HTML.
7. **No Placeholders:** Zero leftover `[TODO`, `[CONFIRM`, `[Month Year]` strings.
8. **Ecosystem Updates:**
   * Add to `sitemap.xml` with current timestamp.
   * Add to `llms.txt` and `llm.txt`.
   * Add to `CANONICAL_PAGES` in `scripts/check-site.py`.
   * Add to footer "Services" column across all HTML pages.

