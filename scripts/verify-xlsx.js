const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const trimmed = path.join(dataDir, 'products.trimmed.csv');
const csvPath = fs.existsSync(trimmed) ? trimmed : path.join(dataDir, 'products.csv');
const xlsxPath = path.join(dataDir, 'products.xlsx');
const reportPath = path.join(dataDir, 'reports', 'verify-report.json');

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

if (!fs.existsSync(csvPath)) {
  console.error('CSV not found at', csvPath);
  process.exit(1);
}
if (!fs.existsSync(xlsxPath)) {
  console.error('XLSX not found at', xlsxPath);
  process.exit(1);
}

const csvContents = fs.readFileSync(csvPath, 'utf8');
const { headers: csvHeaders, rows: csvRows } = tolerantParseCsv(csvContents);

const wb = XLSX.readFile(xlsxPath);
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
const json = XLSX.utils.sheet_to_json(ws, { defval: '' });

const xlsxHeaders = json.length > 0 ? Object.keys(json[0]) : csvHeaders;
const xlsxRows = json;

const headerDiff = {
  inCsvNotXlsx: csvHeaders.filter(h => !xlsxHeaders.includes(h)),
  inXlsxNotCsv: xlsxHeaders.filter(h => !csvHeaders.includes(h)),
};

const counts = { csv: csvRows.length, xlsx: xlsxRows.length };

// Compare sample first 5 rows by key fields (slug or sku)
function keyForRow(r) { return r.slug || r.sku || JSON.stringify(r).slice(0,50); }
const sampleMismatches = [];
for (let i = 0; i < Math.min(5, csvRows.length, xlsxRows.length); i++) {
  const c = csvRows[i];
  const x = xlsxRows[i];
  const keys = new Set([...Object.keys(c), ...Object.keys(x)]);
  const diffs = [];
  for (const k of keys) {
    const cv = (c[k] || '').toString();
    const xv = (x[k] || '').toString();
    if (cv !== xv) diffs.push({ field: k, csv: cv, xlsx: xv });
  }
  if (diffs.length) sampleMismatches.push({ index: i+1, key: keyForRow(c), diffs });
}

const report = {
  csvPath: path.relative(root, csvPath),
  xlsxPath: path.relative(root, xlsxPath),
  csvRows: csvRows.length,
  xlsxRows: xlsxRows.length,
  headerDiff,
  sampleMismatches,
  timestamp: new Date().toISOString()
};

if (!fs.existsSync(path.join(dataDir, 'reports'))) fs.mkdirSync(path.join(dataDir, 'reports'));
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log('Verify report written to', reportPath);
console.log(`CSV rows: ${report.csvRows}, XLSX rows: ${report.xlsxRows}`);
if (report.headerDiff.inCsvNotXlsx.length || report.headerDiff.inXlsxNotCsv.length) console.log('Header differences found.');
if (report.sampleMismatches.length) console.log('Sample row mismatches found:', report.sampleMismatches.length);
else console.log('First sample rows match.');
