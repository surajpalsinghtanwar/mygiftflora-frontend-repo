const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const dataDir = path.resolve(__dirname, '..', 'src', 'data')
const trimmedPath = path.join(dataDir, 'products.trimmed.csv')
const csvPath = fs.existsSync(trimmedPath) ? trimmedPath : path.join(dataDir, 'products.csv')
const outPath = path.join(dataDir, 'products.xlsx')
const backupPath = path.join(dataDir, 'products.xlsx.bak')

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

function run(){
  if (!fs.existsSync(csvPath)){
    console.error('Missing CSV:', csvPath)
    process.exit(1)
  }
  const contents = fs.readFileSync(csvPath, 'utf8')
  const { headers, rows } = tolerantParseCsv(contents)
  console.log(`Converting ${csvPath} -> ${outPath} (${rows.length} rows, ${headers.length} columns)`)

  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, backupPath)
    console.log('Backed up existing XLSX to', backupPath)
  }

  const wsData = [headers]
  for (const r of rows) wsData.push(headers.map(h => r[h] || ''))
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'products')
  XLSX.writeFile(wb, outPath)
  console.log('Wrote XLSX:', outPath)
}

run()
