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

const missing = { main: [], gallery: [] };

rows.forEach((r, idx) => {
  const main = (r.mainImage || '').trim();
  if (main && !fs.existsSync(path.join(mainDir, main))) missing.main.push({ row: idx + 2, file: main });
  const galleryRaw = (r.galleryImages || '').replace(/^[\[]+|[\]]+$/g, '').trim();
  if (galleryRaw) {
    const items = galleryRaw.split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(f => { if (!fs.existsSync(path.join(galleryDir, f))) missing.gallery.push({ row: idx + 2, file: f }); });
  }
});

const outPath = path.join(reportsDir, 'images-verify-fixed.json');
fs.writeFileSync(outPath, JSON.stringify(missing, null, 2), 'utf8');
console.log('Wrote', outPath);
