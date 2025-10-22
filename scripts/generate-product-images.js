const fs = require('fs');
const path = require('path');

const PRODUCTS_CSV = path.join(__dirname, '..', 'src', 'data', 'products.csv');
const MAIN_DIR = path.join(__dirname, '..', 'src', 'data', 'product_images', 'main');
const GALLERY_DIR = path.join(__dirname, '..', 'src', 'data', 'product_images', 'gallery');

function splitCsvLine(line) {
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      cur += ch;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      parts.push(trimQuotes(cur));
      cur = '';
      continue;
    }
    cur += ch;
  }
  parts.push(trimQuotes(cur));
  return parts;
}

function trimQuotes(s) {
  let t = s === undefined ? '' : s.trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
  return t;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function createPlaceholder(p) {
  if (fs.existsSync(p)) return false;
  const png1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(p, png1x1);
  return true;
}

const csvText = fs.readFileSync(PRODUCTS_CSV, 'utf8');
const lines = csvText.split(/\r?\n/);
if (lines.length === 0) {
  console.error('Empty CSV');
  process.exit(1);
}
const header = splitCsvLine(lines[0]);
const rows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = splitCsvLine(lines[i]);
  // pad cols to header length
  while (cols.length < header.length) cols.push('');
  const obj = {};
  for (let j = 0; j < header.length; j++) obj[header[j]] = cols[j] || '';
  rows.push(obj);
}

ensureDir(MAIN_DIR);
ensureDir(GALLERY_DIR);

const created = { main: [], gallery: [] };

for (const r of rows) {
  const slug = (r.slug || r.sku || '').trim() || `product-${Math.random().toString(36).slice(2,8)}`;
  // MAIN IMAGE
  let main = (r.mainImage || '').trim();
  if (!main || main.startsWith('http')) {
    main = `${slug}-main.jpg`;
    r.mainImage = main;
  }
  // ensure extension
  if (!/\.(jpg|jpeg|png|webp)$/i.test(main)) {
    r.mainImage = `${main}.jpg`;
    main = r.mainImage;
  }
  const mainPath = path.join(MAIN_DIR, main);
  if (createPlaceholder(mainPath)) created.main.push(main);

  // GALLERY IMAGES
  let galleryRaw = (r.galleryImages || '').trim();
  let galleryList = [];
  if (galleryRaw) {
    // parse like [a.jpg,b.jpg] or a.jpg
    const inner = galleryRaw.replace(/^\[|\]$/g, '');
    galleryList = inner.split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
    // filter out URLs
    galleryList = galleryList.filter(fn => !fn.startsWith('http') && /\.(jpg|jpeg|png|webp)$/i.test(fn));
  }
  if (galleryList.length === 0) {
    // generate 2 gallery images by default (can be 1-4); choose 2
    galleryList = [`${slug}-g1.jpg`, `${slug}-g2.jpg`];
  }
  // limit to 4
  galleryList = galleryList.slice(0,4);
  r.galleryImages = `[${galleryList.join(',')}]`;
  for (const g of galleryList) {
    const gp = path.join(GALLERY_DIR, g);
    if (createPlaceholder(gp)) created.gallery.push(g);
  }
}

// Rebuild CSV
const outLines = [];
outLines.push(header.join(','));
for (const r of rows) {
  const row = header.map(h => {
    const v = r[h] === undefined ? '' : String(r[h]);
    // if contains comma or quotes, wrap in quotes and escape
    if (v.includes(',') || v.includes('"') || v.includes('\n')) {
      return '"' + v.replace(/"/g, '""') + '"';
    }
    return v;
  }).join(',');
  outLines.push(row);
}
fs.writeFileSync(PRODUCTS_CSV, outLines.join('\n'));

console.log('Created main images:', created.main.length);
console.log('Created gallery images:', created.gallery.length);
if (created.main.length) console.log(created.main.join('\n'));
if (created.gallery.length) console.log(created.gallery.join('\n'));
console.log('Updated products.csv with normalized image names.');
