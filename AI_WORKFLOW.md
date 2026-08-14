# Purelane — AI Workflow

## Tools used

- **Claude (Cowork)** — used throughout the build for: converting the static HTML/CSS mockup into Shopify Liquid sections, designing the metafield/metaobject data model, debugging CSS/layout issues, and step-by-step guidance through Shopify CLI, Git, and the theme editor (this was my first time building on Shopify).
- **ChatGPT (DALL·E)** — used to generate all 10 product photographs.

## How AI was used, section by section

1. **Mockup analysis** — Claude read through the provided `purelane-homepage.html` file and mapped each visual block (Hero, Shop, Best-selling combos, Bundles, Reviews) to the corresponding CSS classes and markup, so each section could be rebuilt independently in Liquid rather than porting the whole file at once.
2. **Environment setup** — Claude walked through installing Node.js, the Shopify CLI, and Git from scratch, and explained what each command does rather than just providing commands to copy-paste blind.
3. **Section-by-section build** — for each of the 5 sections, Claude: (a) extracted the exact CSS for that section from the mockup, (b) converted the static HTML into Liquid, replacing hardcoded content with schema settings, blocks, collection references, or metaobject loops so every visible piece of content is merchant-editable and backed by real data, and (c) wrote the accompanying CSS/JS as separate per-section asset files.
4. **Product content** — Claude generated product titles, descriptions, and pricing for all 10 products (including the 3 deliberate edge cases — sold out, missing image, long title) based on the mockup's product categories.
5. **Image generation** — Claude wrote a reusable style-prefix prompt (consistent bottle shape, logo, color palette, lighting) plus a specific descriptor line per product, which was fed into ChatGPT to generate each product photo individually, keeping a consistent brand look across all 10 products.
6. **Debugging methodology** — several rounds of CSS layout issues (product images in the Hero section overlapping the heading text; product photos appearing cropped in the Shop grid) were resolved by using browser DevTools to inspect actual computed styles rather than guessing — verifying which CSS rule was actually winning before changing anything, and switching from assumption-based fixes to a mathematically bounded approach (sizing images by width percentage instead of height, with `overflow:hidden` as a hard limit) once the root cause was confirmed.
7. **Incident recovery** — when a Shopify CLI command overwrote the wrong theme mid-build (documented in `BUILD_NOTES.md`), Claude walked through a full recovery: identifying what was lost via `git log`, resetting local files to the last clean commit, and re-establishing a safer workflow (pinned theme ID on every command, commit-and-push after every single file) to prevent recurrence.

## What was manually reviewed at each step

- Every section's rendering was checked against the original mockup via screenshots, on both desktop and mobile views, before moving to the next section.
- All 3 required edge cases (sold out, missing image, long title) were manually verified to render correctly in every section that displays product data — not just the Shop grid, but also inside Combos and Bundles.
- Metafield and metaobject values (ratings, combo pricing, review content) were entered manually through the Shopify admin, not generated or seeded programmatically.
- All Liquid code was reviewed for the "no hardcoded content" requirement — every price, title, and image reference traces back to a real product, metafield, or metaobject entry rather than being written directly into a template file.