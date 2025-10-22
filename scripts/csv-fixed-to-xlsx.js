#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const repoRoot = path.resolve(__dirname, '..');
const dataDir = path.join(repoRoot, 'src', 'data');
const inPath = fs.existsSync(path.join(dataDir, 'products.fixed.final.csv')) ? path.join(dataDir, 'products.fixed.final.csv') : path.join(dataDir, 'products.fixed.csv');
const outPath = path.join(dataDir, 'products.fixed.xlsx');

if (!fs.existsSync(inPath)) {
  console.error('Missing input CSV at', inPath);
  process.exit(1);
}

const csv = fs.readFileSync(inPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(Boolean).map(l => {
  // simple CSV split that respects quoted fields approximately
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (ch === '"') { inQuotes = !inQuotes; cur += ch; continue; }
    if (ch === ',' && !inQuotes) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts.map(p => p.replace(/^"|"$/g, '').replace(/""/g, '"'));
});
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet(lines);
xlsx.utils.book_append_sheet(wb, ws, 'Products');
xlsx.writeFile(wb, outPath);
console.log('Wrote', outPath);
