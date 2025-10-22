#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const repoRoot = path.resolve(__dirname, '..');
const dataDir = path.join(repoRoot, 'src', 'data');
const reportsDir = path.join(dataDir, 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const inPath = fs.existsSync(path.join(dataDir, 'products.fixed.final.csv')) ? path.join(dataDir, 'products.fixed.final.csv') : path.join(dataDir, 'products.fixed.csv');
const outPath = path.join(dataDir, 'products.fixed.ready.csv');
const reportPath = path.join(reportsDir, 'prepare-import-report.json');

if (!fs.existsSync(inPath)) { console.error('Missing', inPath); process.exit(1); }
const raw = fs.readFileSync(inPath, 'utf8');
const rows = parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });
const headerLine = raw.split(/\r?\n/)[0];

function normalizeStatus(s) {
  if (s == null) return 'inactive';
  const v = String(s).trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes' || v === 'active') return 'active';
  return 'inactive';
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const slugMap = {};
const skuMap = {};
const report = { total: rows.length, slugChanges: [], skuChanges: [], statusNormalized: 0 };

const outRows = rows.map((r, idx) => {
  const out = Object.assign({}, r);
  // normalize status
  const oldStatus = out.status;
  const newStatus = normalizeStatus(oldStatus);
  if (oldStatus !== newStatus) { report.statusNormalized++; }
  out.status = newStatus;

  // normalize slug and ensure uniqueness
  let slug = (out.slug || '').toString().trim();
  if (!slug) slug = ((out.name || '').toString().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g,'-').replace(/^-|-$/g,'')) || 'item';
  let base = slug;
  let counter = 1;
  while (slugMap[slug]) { slug = base + '-u' + counter; counter++; }
  if (slug !== (out.slug || '')) report.slugChanges.push({ row: idx + 2, original: out.slug || '', updated: slug });
  slugMap[slug] = true;
  out.slug = slug;

  // ensure unique SKU
  let sku = (out.sku || '').toString().trim();
  if (!sku) sku = slug;
  base = sku;
  counter = 1;
  while (skuMap[sku]) { sku = base + '-u' + counter; counter++; }
  if (sku !== (out.sku || '')) report.skuChanges.push({ row: idx + 2, original: out.sku || '', updated: sku });
  skuMap[sku] = true;
  out.sku = sku;

  return out;
});

// write CSV
const keys = headerLine.split(',');
const lines = [headerLine];
for (const r of outRows) {
  const vals = keys.map(k => csvEscape(r[k]));
  lines.push(vals.join(','));
}
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log('Wrote', outPath);
console.log('Report written to', reportPath);
