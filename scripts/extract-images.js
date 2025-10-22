const fs = require('fs');
const path = require('path');

const PRODUCTS_CSV = path.join(__dirname, '..', 'src', 'data', 'products.csv');
const MAIN_DIR = path.join(__dirname, '..', 'src', 'data', 'product_images', 'main');
const GALLERY_DIR = path.join(__dirname, '..', 'src', 'data', 'product_images', 'gallery');

function parseCsvRows(csvText) {
  const rows = [];
  const lines = csvText.split(/\r?\n/);
  if (lines.length === 0) return rows;
  const headerLine = lines.shift();
  const headers = splitCsvLine(headerLine);
  for (const l of lines) {
    if (!l.trim()) continue;
    const cols = splitCsvLine(l);
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = cols[i] || '';
    }
    rows.push(obj);
  }
  return rows;
}

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
  let t = s.trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
  return t;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function createPlaceholder(p) {
  if (fs.existsSync(p)) return false;
  // create a tiny 1x1 PNG placeholder binary to be slightly more realistic
  const png1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(p, png1x1);
  return true;
}

const csvText = fs.readFileSync(PRODUCTS_CSV, 'utf8');
const rows = parseCsvRows(csvText);

const mains = new Set();
const galleries = new Set();

for (const r of rows) {
  const main = (r.mainImage || '').trim();
  if (main && !main.startsWith('http') && /\.(jpg|jpeg|png|webp)$/i.test(main)) mains.add(main);
  const gal = (r.galleryImages || '').trim();
  if (gal) {
    // gallery looks like [a.jpg,b.jpg]
    const inner = gal.replace(/^\[|\]$/g, '');
    inner.split(',').map(x => x.trim().replace(/^\[|\]$/g, '').replace(/^"|"$/g, '')).filter(Boolean).forEach(fn => {
      if (!fn.startsWith('http') && /\.(jpg|jpeg|png|webp)$/i.test(fn)) galleries.add(fn);
    });
  }
}

ensureDir(MAIN_DIR);
ensureDir(GALLERY_DIR);

const created = { main: [], gallery: [] };
for (const m of mains) {
  const p = path.join(MAIN_DIR, m);
  if (createPlaceholder(p)) created.main.push(m);
}
for (const g of galleries) {
  const p = path.join(GALLERY_DIR, g);
  if (createPlaceholder(p)) created.gallery.push(g);
}

console.log('Created main images:', created.main.length);
console.log('Created gallery images:', created.gallery.length);
if (created.main.length > 0) console.log(created.main.join('\n'));
if (created.gallery.length > 0) console.log(created.gallery.join('\n'));

// mark todos: completed steps 2 and 3
console.log('Done');
