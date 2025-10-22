const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const trimmed = path.join(dataDir, 'products.trimmed.csv');
const csv = fs.existsSync(trimmed) ? trimmed : path.join(dataDir, 'products.csv');
const mainDir = path.join(dataDir, 'product_images', 'main');
const galleryDir = path.join(dataDir, 'product_images', 'gallery');
const reportDir = path.join(dataDir, 'reports'); if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, 'images-verify-trimmed.json');

function tolerantParseCsv(contents) {
  const lines = contents.split(/\r?\n/);
  function parseLine(line) {
    const fields = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) { fields.push(cur); cur = ''; } else { cur += ch; }
    }
    fields.push(cur);
    return fields.map(f => { let v = f.trim(); if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1); return v.replace(/""/g, '"'); });
  }

  let headerIdx = 0; while (headerIdx < lines.length && lines[headerIdx].trim() === '') headerIdx++;
  if (headerIdx >= lines.length) return { headers: [], rows: [] };
  const headers = parseLine(lines[headerIdx]);
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    let acc = lines[i];
    let quoteCount = (acc.match(/"/g) || []).length;
    while (quoteCount % 2 === 1 && i + 1 < lines.length) { i++; acc += '\n' + lines[i]; quoteCount = (acc.match(/"/g) || []).length; }
    const fields = parseLine(acc);
    while (fields.length < headers.length) fields.push('');
    const obj = {};
    for (let j = 0; j < headers.length; j++) obj[headers[j]] = fields[j] !== undefined ? fields[j] : '';
    rows.push(obj);
  }
  return { headers, rows };
}

if (!fs.existsSync(csv)) { console.error('CSV not found:', csv); process.exit(1); }
const contents = fs.readFileSync(csv, 'utf8');
const { rows } = tolerantParseCsv(contents);

const mainMissing = [];
const galleryMissing = [];
let mainCount = 0, galleryCount = 0;

for (const r of rows) {
  const main = (r.mainImage || '').trim();
  if (main) {
    mainCount++;
    const p = path.join(mainDir, main);
    if (!fs.existsSync(p)) mainMissing.push(main);
  }
  const raw = (r.galleryImages || '').trim();
  if (raw) {
    const g = raw.replace(/^[\[\]"]+|[\[\]"]+$/g, '');
    if (g) {
      const parts = g.split(',').map(s=>s.trim()).filter(Boolean);
      galleryCount += parts.length;
      for (const fn of parts) {
        const p = path.join(galleryDir, fn);
        if (!fs.existsSync(p)) galleryMissing.push(fn);
      }
    }
  }
}

const report = {
  csv: path.relative(root, csv),
  rows: rows.length,
  mainImagesReferenced: mainCount,
  galleryImagesReferenced: galleryCount,
  mainMissing: Array.from(new Set(mainMissing)),
  galleryMissing: Array.from(new Set(galleryMissing)),
  timestamp: new Date().toISOString()
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log('Images verify report written to', reportPath);
console.log(`Rows: ${report.rows}, main refs: ${report.mainImagesReferenced}, gallery refs: ${report.galleryImagesReferenced}`);
console.log(`Missing main images: ${report.mainMissing.length}, missing gallery images: ${report.galleryMissing.length}`);
