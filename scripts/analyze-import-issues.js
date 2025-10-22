#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const repoRoot = path.resolve(__dirname, '..');
const dataDir = path.join(repoRoot, 'src', 'data');
const mainDir = path.join(dataDir, 'product_images', 'main');
const galleryDir = path.join(dataDir, 'product_images', 'gallery');
const reportsDir = path.join(dataDir, 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const inPath = fs.existsSync(path.join(dataDir, 'products.fixed.final.csv')) ? path.join(dataDir, 'products.fixed.final.csv') : path.join(dataDir, 'products.fixed.csv');
if (!fs.existsSync(inPath)) { console.error('Missing', inPath); process.exit(1); }

const raw = fs.readFileSync(inPath, 'utf8');
const rows = parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });

const report = {
  total: rows.length,
  statusValues: {},
  categoryIdNonNumeric: 0,
  subcategoryIdNonNumeric: 0,
  subsubcategoryIdNonNumeric: 0,
  skuDuplicates: [],
  slugDuplicates: [],
  zeroOrMissingPrice: [],
  variantJsonErrors: [],
  missingMainImages: [],
  missingGalleryImages: [],
};

const skuMap = {};
const slugMap = {};

rows.forEach((r, idx) => {
  const rowNum = idx + 2;
  const status = (r.status || '').toString().trim();
  report.statusValues[status] = (report.statusValues[status] || 0) + 1;

  const catId = (r.category_id || r.category || '').toString().trim();
  if (catId && isNaN(Number(catId))) report.categoryIdNonNumeric++;
  const subId = (r.subcategory_id || r.subcategory || '').toString().trim();
  if (subId && isNaN(Number(subId))) report.subcategoryIdNonNumeric++;
  const subsubId = (r.subsubcategory_id || r.subsubcategory || '').toString().trim();
  if (subsubId && isNaN(Number(subsubId))) report.subsubcategoryIdNonNumeric++;

  const sku = (r.sku || '').toString().trim();
  if (sku) { skuMap[sku] = skuMap[sku] || []; skuMap[sku].push(rowNum); }
  const slug = (r.slug || '').toString().trim();
  if (slug) { slugMap[slug] = slugMap[slug] || []; slugMap[slug].push(rowNum); }

  const price = Number(r.price || 0);
  if (!price || price <= 0) report.zeroOrMissingPrice.push({ row: rowNum, price: r.price });

  if (r.variants) {
    try { JSON.parse(r.variants); } catch (e) { report.variantJsonErrors.push({ row: rowNum, error: e.message }); }
  }

  const main = (r.mainImage || '').trim();
  if (main && !fs.existsSync(path.join(mainDir, main))) report.missingMainImages.push({ row: rowNum, file: main });

  const galleryRaw = (r.galleryImages || '').replace(/^[\[]+|[\]]+$/g, '').trim();
  if (galleryRaw) {
    const items = galleryRaw.split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(f => { if (!fs.existsSync(path.join(galleryDir, f))) report.missingGalleryImages.push({ row: rowNum, file: f }); });
  }
});

Object.keys(skuMap).forEach(k => { if (skuMap[k].length > 1) report.skuDuplicates.push({ sku: k, rows: skuMap[k] }); });
Object.keys(slugMap).forEach(k => { if (slugMap[k].length > 1) report.slugDuplicates.push({ slug: k, rows: slugMap[k] }); });

const outPath = path.join(reportsDir, 'import-analysis.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
console.log('Wrote', outPath);
