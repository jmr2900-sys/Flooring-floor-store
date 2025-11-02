# Resolve Catalog Integration (Vercel + GitHub)

This drop-in adds a script and a GitHub Action that build **public/catalog.json**
with **all Resolve SKUs + image URLs** by crawling public pages on resolvefloor.com.

## Quick setup

1. Copy the `scripts/` folder, `.github/workflows/build-catalog.yml`, and merge the fields from `package.extend.json`
   into your project's `package.json` (add the `scripts.catalog:resolve`, `type: module`, and devDependencies).
2. Commit & push to GitHub.
3. In GitHub → **Actions** → **Build Resolve Catalog** → **Run workflow**.

The action will write `public/catalog.json` into your repo and push it back. Vercel will auto‑redeploy and your `/app/page.js` (which fetches `/catalog.json`) will display every SKU with images.

## Run locally

```bash
npm install
npm install --save-dev cheerio@1.0.0-rc.12 node-fetch@3.3.2
node scripts/fetch_resolve_catalog.mjs
```

This writes `public/catalog.json`. Commit it and push to redeploy.

---

**Note:** If Resolve changes HTML structure, update the selectors in `fetch_resolve_catalog.mjs`.
