#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const repoRoot = path.resolve(__dirname, '..');
const dataDir = path.join(repoRoot, 'src', 'data');
const reportsDir = path.join(dataDir, 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

function readCSV(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });
  } catch (err) {
    const lines = raw.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = cols[j] ? cols[j].trim() : '';
      }
      rows.push(obj);
    }
    return rows;
  }
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const inPath = path.join(dataDir, 'products.fixed.csv');
const outPath = path.join(dataDir, 'products.fixed.final.csv');
const reportPath = path.join(reportsDir, 'products-enforce-report.json');

if (!fs.existsSync(inPath)) {
  console.error('Missing', inPath);
  process.exit(1);
}

const rows = readCSV(inPath);
const headerLine = fs.readFileSync(inPath, 'utf8').split(/\r?\n/)[0];

const groups = {};
function keyOf(r) { return `${r.category || ''}|||${r.subcategory || ''}|||${r.subsubcategory || ''}`; }

rows.forEach(r => {
  const k = keyOf(r);
  groups[k] = groups[k] || [];
  groups[k].push(r);
});

const MIN = 8;
const MAX = 10;
let clones = 0;
let trimmed = 0;

// helper to clone
function cloneRow(orig, n) {
  const clone = Object.assign({}, orig);
  clone.sku = (orig.sku || '') + '-f' + n;
  clone.slug = (orig.slug || '') + '-f' + n;
  clone.name = (orig.name || '') + ' (auto f' + n + ')';
  return clone;
}

const finalRows = [];

Object.keys(groups).forEach(k => {
  const list = groups[k];
  if (list.length > MAX) {
    // keep first MAX
    finalRows.push(...list.slice(0, MAX));
    trimmed += list.length - MAX;
  } else if (list.length < MIN) {
    finalRows.push(...list);
    // clone to reach MIN
    const need = MIN - list.length;
    for (let i = 0; i < need; i++) {
      clones++;
      finalRows.push(cloneRow(list[i % list.length || 0], clones));
    }
  } else {
    finalRows.push(...list);
  }
});

// write CSV
const keys = headerLine.split(',');
const outLines = [headerLine];
for (const r of finalRows) {
  const vals = keys.map(k => csvEscape(r[k]));
  outLines.push(vals.join(','));
}
fs.writeFileSync(outPath, outLines.join('\n'), 'utf8');

const report = { originalRows: rows.length, finalRows: finalRows.length, clonesAdded: clones, rowsTrimmed: trimmed };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log('Wrote', outPath);
console.log('Report:', reportPath);
