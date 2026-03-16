# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
sudo just serve    # Local development server (bundle exec jekyll serve)
sudo just build    # Build site to docs/ (bundle exec jekyll build)
```

Ruby 3.3 is required (managed via mise). Dependencies: `bundle install`.

## Architecture

**Red Letter Clay** is a handmade pottery e-commerce site built with Jekyll 4.3, deployed to GitHub Pages via a GitHub Actions workflow that builds the site and then triggers a Snipcart product recrawl.

**Output destination:** `docs/` (not the default `_site/`)

### E-commerce

- **Snipcart** handles cart, checkout, and payment — configured via `_includes/snipcart.html` and `assets/js/snipcart.js`
- **Stock availability** is fetched at runtime from a DigitalOcean serverless function via `assets/js/stock.js`
- **Geolocation** (`assets/js/geolocation.js`) detects if a customer is in the local pickup zone; `_data/ecommerce.yml` controls shipping/pickup settings and the local pickup zone toggle
- **`snipcart.json.html`** is a product feed endpoint that Snipcart crawls after each deployment
For details on Snipcart Usage and API authentication, refer to the [Snipcart Documentation](https://docs.snipcart.com/v3/).


### Products

Products live in `_products/` as Markdown files with YAML frontmatter. Naming convention: `{TYPE}-{ID}-{COLOR}.md` (e.g. `M-0001-GRN.md` = Mug 0001 Green). Types: M (Mug), B (Bowl), J (Jar), T (Tray), P (Planter), C (Cup), PNT (Planter). Sold items are archived in `_products_sold/`.

Product order on the shop page is controlled explicitly in `_config.yml` under the `collections` key.

### Data Files (`_data/`)

| File | Purpose |
|------|---------|
| `announcement.yml` | Sitewide banner (shop status, exhibition notices) |
| `events.yml` | Market appearances and show calendar |
| `stockists.yml` | Retail partner info |
| `ecommerce.yml` | Shipping rules and local pickup zone toggle |
| `newsletter.yml` | Email signup configuration |
| `links.yml` | Navigation and social links |
| `mugs.yml` | Gallery thumbnail references |

### Styling

Bootstrap 5.3.3 is loaded from CDN. Custom styles are in `_sass/main.scss` (compiled to `assets/css/main.scss`). Products have a color-code system in CSS: GRN, BLU, PUR, COP, BRN, BLK, WHT, TEM.

### Pagination

The shop uses `jekyll-paginate-v2` (12 products per page). Journal posts use the standard Jekyll paginator. Both are configured in `_config.yml`.
