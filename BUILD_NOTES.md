# Purelane — Build Notes

## Overview

This theme replicates the Purelane homepage mockup on Shopify's Dawn theme, built as 5 custom sections with real, merchant-editable data pulled from products, product metafields, and two custom metaobject types (no hardcoded content in any Liquid file).

- Store: falah-devstore.myshopify.com
- Theme: Dawn (theme ID 149578612957)
- Sections built: Hero, Shop (product grid), Combos, Bundles, Reviews

## Architecture

- `assets/purelane-theme.css` — one shared global stylesheet (CSS variables, typography, buttons, glass panel styles, scroll-reveal utilities, section shell) loaded site-wide via `layout/theme.liquid`.
- `snippets/purelane-background.liquid` + `assets/purelane-theme.js` — a simplified animated gradient background rendered once, shared across all sections.
- Each of the 5 sections has its own `sections/purelane-*.liquid` file plus a matching `assets/section-*.css` (and `section-hero.js` for the Hero product rotator), loaded only on that section rather than bundled globally.

### Scope decision: simplified background

The original mockup's animated background includes wavy SVG water line-art and floating bubble particles layered under gradient "scenes." To keep the build focused on the 5 required sections within the timeline, I implemented only the gradient scene crossfade (color/mood shifts per section) and skipped the wavy SVG line art and floating bubbles.

### Design decision: real product photography vs. the mockup's vector art

The original mockup used small hand-illustrated SVG bottle graphics for all product imagery. This build uses real AI-generated product photography instead, since the assignment calls for real Shopify data end-to-end. This required reworking the Hero section's image layout: vector illustrations and photographs have very different width-to-height proportions, so the Hero's product stage was rebuilt to size images by width percentage (with `overflow:hidden` as a safety net) rather than by height, guaranteeing images can never spill outside their container regardless of a photo's exact proportions.

## Section-by-section

**1. Purelane Hero** — Editable heading/lede/CTA text via section settings, plus up to 3 "slide" blocks (Single bottle / Any 2 products / Any 3 products, reorderable in the theme editor) each referencing real products for image, price, and compare-at price. Auto-rotates every 3.8s, pauses on hover/off-screen. Trust badges render as a horizontal row beneath the CTA buttons.

**2. Purelane Shop** — Merchant picks a real Shopify collection in the section settings; the section loops `collection.products` and pulls title, image, price, compare-at price, and availability directly — no products are named in the template.

**3. Purelane Combos** — Backed by a `Combo` metaobject (see below). Each combo entry references 2–5 real products; the section computes savings and the "Includes: ..." copy dynamically from whichever products are attached.

**4. Purelane Bundles** — 3 pricing-tier blocks (editable in the theme editor), each with optional preview-product references so the stacked product thumbnails are real product photos.

**5. Purelane Reviews** — Backed by a `Review` metaobject (see below). Cards auto-scroll in a CSS marquee; star rating renders dynamically per review, and each review links to a real product.

## Metafield & metaobject definitions

**Product metafields**
| Namespace.key | Type | Used for |
|---|---|---|
| `custom.rating` | Decimal number | Optional star rating shown on Shop grid cards |
| `custom.review_count` | Integer | Optional review count shown next to rating |

**Metaobject: Combo** (`combo`)
| Field | Key | Type |
|---|---|---|
| Title | `title` | Single line text |
| Products | `products` | Product (list, max 5) |
| Combo price | `combo_price` | Decimal number |
| Compare at price | `compare_at_price` | Decimal number |
| Badge text | `badge_text` | Single line text |
| Featured | `featured` | True or false |

**Metaobject: Review** (`review`)
| Field | Key | Type |
|---|---|---|
| Reviewer name | `reviewer_name` | Single line text |
| Quote title | `quote_title` | Single line text |
| Quote body | `quote_body` | Multi-line text |
| Product | `product` | Product |
| Rating | `rating` | Integer |

## Edge cases (required by the assignment)

- **Sold out** — Magic Eraser (Metal Scrubber) has inventory set to 0 with "Continue selling when out of stock" off. The Shop grid shows a disabled "Sold out" button; the same product also appears inside the "Bathroom deep clean" combo to confirm it degrades gracefully there too.
- **Missing image** — Toilet Cleaner has no product image uploaded. Every place a product image is rendered (Shop grid, Combo stack, Bundle tier preview) checks `product.featured_image != blank` and falls back to a simple inline SVG placeholder icon instead of a broken image.
- **Long title** — "Concentrated Plant-Based Washing Machine Deep-Clean Descaler Tablets for Hard Water & Limescale Removal, Pack of 12" is used to test title overflow. Shop grid card titles use `-webkit-line-clamp` to cap at 3 lines; the Reviews card's product-reference text truncates with an ellipsis instead of wrapping and breaking the card layout.

## Notable issues and recovery

**Theme sync incident** — Partway through building the Hero section, an unscoped `shopify theme pull` (without the `--theme` flag) opened a theme selection prompt and pulled the wrong theme, overwriting local files while a stale `shopify theme dev` session was still running — which pushed that reversion to the live theme too. Recovered by closing all running CLI sessions, deleting the corrupted theme, resetting local files to the last known-good GitHub commit (`git reset --hard origin/main && git clean -fd`), and re-pushing a clean state. Since then, every `shopify theme` command explicitly pins `--theme=149578612957`, and every file is committed and pushed individually rather than batched.

**Hero image overlap debugging** — Swapping the mockup's slim vector bottle art for real product photography caused the product image stage to visually overlap the heading/body text at several points during development. Root-caused through browser DevTools inspection (checking computed styles rather than assuming): the images' own intrinsic proportions were wider than expected, and CSS flexbox's default `min-width: auto` behavior was letting content overflow its allocated space. Fixed by switching image sizing from height-based to width-based percentages (which can be bounded with certainty) plus `overflow:hidden` as a hard safety net, guaranteeing the images can never bleed outside their container regardless of a given photo's proportions.

## Local development

```
shopify theme dev --store=falah-devstore.myshopify.com --theme=149578612957
shopify theme push --store=falah-devstore.myshopify.com --theme=149578612957
shopify theme pull --store=falah-devstore.myshopify.com --theme=149578612957
```