const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const productsCsv = path.join(dataDir, 'products.csv');
const backupCsv = path.join(dataDir, 'products.backup.csv');
const trimmedCsv = path.join(dataDir, 'products.trimmed.csv');

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

(function main() {
  if (!fs.existsSync(productsCsv)) return console.error('products.csv not found at', productsCsv);
  const contents = fs.readFileSync(productsCsv, 'utf8');
  const { headers, rows } = tolerantParseCsv(contents);
  console.log(`Parsed ${rows.length} rows with ${headers.length} columns.`);

  // backup
  if (!fs.existsSync(backupCsv)) {
    fs.copyFileSync(productsCsv, backupCsv);
    console.log('Backup written to', backupCsv);
  } else {
    console.log('Backup already exists at', backupCsv);
  }

  const perSubcat = {};
  const kept = [];
  const removed = [];
  for (const r of rows) {
    const subcat = (r.subcategory || '').trim();
    perSubcat[subcat] = perSubcat[subcat] || 0;
    if (perSubcat[subcat] < 10) {
      kept.push(r);
      perSubcat[subcat]++;
    } else {
      removed.push(r);
    }
  }

  // reserialize kept rows to CSV
  function csvEscape(v) {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('\n') || s.includes('"')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  const outLines = [];
  outLines.push(headers.join(','));
  for (const r of kept) {
    const row = headers.map(h => csvEscape(r[h]));
    outLines.push(row.join(','));
  }
  fs.writeFileSync(trimmedCsv, outLines.join('\n'), 'utf8');
  console.log(`Trimmed CSV written to ${trimmedCsv}. Kept: ${kept.length}, Removed: ${removed.length}`);

  // summary by subcategory
  const keptCounts = {};
  for (const r of kept) { const sc = (r.subcategory||'').trim(); keptCounts[sc] = (keptCounts[sc] || 0) + 1; }
  const problemSubcats = [];
  for (const sc of Object.keys(keptCounts)) { if (keptCounts[sc] < 5 || keptCounts[sc] > 10) problemSubcats.push({ subcategory: sc, count: keptCounts[sc] }); }

  const report = {
    originalRows: rows.length,
    kept: kept.length,
    removed: removed.length,
    keptCounts,
    problemSubcats,
    timestamp: new Date().toISOString()
  };
  const reportDir = path.join(dataDir, 'reports'); if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'trim-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('Trim report written to', reportPath);
})();
