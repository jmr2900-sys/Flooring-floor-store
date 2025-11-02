/**
 * Build catalog.json with all Resolve products (name, SKU, URL, image) by crawling public pages.
 * Usage: node scripts/fetch_resolve_catalog.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const BASE = 'https://resolvefloor.com';
const COLLECTIONS = [
  '/products/resolve-unique/',
  '/products/resolve-12-0-wpc/',
  '/products/resolve-8-0/',
  '/products/resolve-7-0-rigid-core/',
  '/products/resolve-6-0/',
  '/products/resolve-5-0-rigid-core/',
  '/products/r-4-7mm/'
];

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'FlooringFloorStoreBot/1.0 (+https://flooringfloorstore.com)' } });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
  return await r.text();
}

function abs(href) {
  if (!href) return null;
  if (href.startsWith('http')) return href;
  return new URL(href, BASE).href;
}

function parseProductsFromCollection(html, collectionSlug) {
  const $ = cheerio.load(html);
  const items = [];
  $('a[href*="/products/"]').each((_, a) => {
    const href = abs($(a).attr('href'));
    if (!href || !href.includes('/products/')) return;
    // skip obvious collection self-links
    const tail = href.replace(/\/$/, '').split('/').pop();
    if (!tail || tail === collectionSlug) return;
    // title
    const title = ($(a).text() || '').trim();
    // heuristics: SKUs are often the first token (TC###, TS###, 416XXX etc.)
    const slug = tail;
    let id = slug.split('-')[0].toUpperCase();
    // allow 416XXX style where slug might not start with numbers
    if (!/[A-Z0-9]/.test(id)) id = (title.split(' ')[0] || '').toUpperCase();
    items.push({ href, title, id });
  });
  // de-dupe by href
  const seen = new Set();
  return items.filter(x => !seen.has(x.href) && seen.add(x.href));
}

function pickImage($) {
  // try og:image first
  const og = $('meta[property="og:image"]').attr('content');
  if (og) return og;
  // try featured img
  const img = $('article img').first().attr('src') || $('img').first().attr('src');
  return img || null;
}

async function enrichProduct(p) {
  try {
    const html = await get(p.href);
    const $ = cheerio.load(html);
    const image = abs(pickImage($));
    // derive name from h1 or title
    const name = ($('h1').first().text() || $('title').text() || p.title).trim();
    // attempt collection name from breadcrumbs
    const crumbs = $('a').map((_,a)=>$(a).text().trim()).get().join(' | ');
    let collection = '';
    if (/Resolve 12.0 WPC/i.test(crumbs)) collection = 'Resolve 12.0 WPC';
    else if (/Resolve 8.0 WPC/i.test(crumbs)) collection = 'Resolve 8.0 WPC';
    else if (/Resolve 7.0 Rigid Core/i.test(crumbs)) collection = 'Resolve 7.0 Rigid Core';
    else if (/Resolve 6.0 Rigid Core/i.test(crumbs)) collection = 'Resolve 6.0 Rigid Core';
    else if (/Resolve 5.0 Rigid Core/i.test(crumbs)) collection = 'Resolve 5.0 Rigid Core';
    else if (/Resolve Unique/i.test(crumbs)) collection = 'Resolve Unique';
    else if (/R\+ 4.7mm/i.test(crumbs)) collection = 'R+ 4.7mm';
    // normalize id
    let id = p.id;
    if (!/^[A-Z0-9]+$/.test(id)) {
      const m = name.match(/([A-Z]{1,3}\d{2,4})/);
      if (m) id = m[1];
    }
    return {
      id,
      name,
      brand: 'Resolve',
      collection,
      category: 'LVP',
      wearLayerMil: '',
      thicknessMm: '',
      color: name.replace(/^\S+\s+/, ''),
      size: '',
      coverageSqFt: '',
      url: p.href,
      image: image || ''
    };
  } catch (e) {
    return null;
  }
}

async function main() {
  const results = [];
  for (const coll of COLLECTIONS) {
    const url = abs(coll);
    try {
      const html = await get(url);
      const slug = url.replace(/\/$/,'').split('/').pop();
      const found = parseProductsFromCollection(html, slug);
      for (const p of found) {
        const full = await enrichProduct(p);
        if (full) results.push(full);
        await new Promise(r=>setTimeout(r, 300)); // be polite
      }
    } catch (e) {
      // skip
    }
  }
  // de-dupe by URL
  const seen = new Set();
  const uniq = results.filter(r => r && !seen.has(r.url) && seen.add(r.url));
  const outPath = path.join(process.cwd(), 'public', 'catalog.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(uniq, null, 2));
  console.log('Wrote', outPath, uniq.length, 'products');
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
