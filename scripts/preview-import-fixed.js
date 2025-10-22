#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const repoRoot = path.resolve(__dirname, '..');
const dataDir = path.join(repoRoot, 'src', 'data');
const inPath = fs.existsSync(path.join(dataDir, 'products.fixed.final.csv')) ? path.join(dataDir, 'products.fixed.final.csv') : path.join(dataDir, 'products.fixed.csv');
if (!fs.existsSync(inPath)) { console.error('Missing', inPath); process.exit(1); }

const raw = fs.readFileSync(inPath, 'utf8');
const rows = parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });

function buildPayload(row) {
  const payload = {
    name: row.name || '',
    description: row.description || '',
    shortDescription: row.shortDescription || '',
    sku: row.sku || '',
    stock: Number(row.stock || 0),
    category_id: row.category_id || row.category || '',
    subcategory_id: row.subcategory_id || row.subcategory || '',
    subsubcategory_id: row.subsubcategory_id || row.subsubcategory || '',
    status: row.status || 'active',
    featured: (row.featured || 'false').toLowerCase() === 'true',
    newArrival: (row.newArrival || 'false').toLowerCase() === 'true',
    todaysSpecial: (row.todaysSpecial || 'false').toLowerCase() === 'true',
    delivery_type: row.delivery_type || '',
    brand: row.brand || '',
    seoTitle: row.seoTitle || '',
    seoDescription: row.seoDescription || '',
    seoKeywords: row.seoKeywords || '',
    slug: row.slug || '',
    mainImage: row.mainImage || '',
    galleryImages: [],
    price: Number(row.price || 0),
    discounted_price: Number(row.discounted_price || 0),
    variants: []
  };
  if (row.galleryImages) {
    const g = row.galleryImages.replace(/^[\[\]"]+|[\[\]"]+$/g, '');
    if (g) payload.galleryImages = g.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (row.variants) {
    try { payload.variants = JSON.parse(row.variants); } catch (e) { payload.variants = []; }
  }
  return payload;
}

const limitArg = process.argv.find(a => a.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : 20;
console.log('Reading', inPath, 'rows:', rows.length, 'showing first', limit);
for (let i = 0; i < Math.min(limit, rows.length); i++) {
  const p = rows[i];
  const payload = buildPayload(p);
  console.log('\n--- Row', i + 1, 'sku=', payload.sku, 'slug=', payload.slug, 'category_id=', payload.category_id, 'subcategory_id=', payload.subcategory_id, 'subsubcategory_id=', payload.subsubcategory_id);
  console.log(JSON.stringify(payload, null, 2));
}

console.log('\nPreview finished.');
