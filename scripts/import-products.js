const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const productsCsv = path.join(dataDir, 'products.csv');

function readCsv(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');
  const lines = contents.split(/\r?\n/);

  function parseLine(line) {
    const fields = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        fields.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    fields.push(cur);
    return fields.map(f => {
      let v = f;
      v = v.trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      return v.replace(/""/g, '"');
    });
  }

  let headerIdx = 0;
  while (headerIdx < lines.length && lines[headerIdx].trim() === '') headerIdx++;
  if (headerIdx >= lines.length) return [];
  const headers = parseLine(lines[headerIdx]);
  const records = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    let acc = lines[i];
    let quoteCount = (acc.match(/"/g) || []).length;
    while (quoteCount % 2 === 1 && i + 1 < lines.length) {
      i++;
      acc += '\n' + lines[i];
      quoteCount = (acc.match(/"/g) || []).length;
    }
    const fields = parseLine(acc);
    if (fields.length < headers.length) {
      while (fields.length < headers.length) fields.push('');
    }
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = fields[j] !== undefined ? fields[j] : '';
    }
    records.push(obj);
  }
  return records;
}

function buildPayload(row) {
  // Map CSV fields to expected API payload shape
  const payload = {
    name: row.name || '',
    description: row.description || '',
    shortDescription: row.shortDescription || '',
    sku: row.sku || '',
    stock: Number(row.stock || 0),
    category_id: row.category_id || row.category || '',
    subcategory_id: row.subcategory_id || row.subcategory || '',
    subsubcategory_id: row.subsubcategory_id || row.subsubcategory || '',
    status: row.status || 'active',
    featured: (row.featured || 'false').toLowerCase() === 'true',
    newArrival: (row.newArrival || 'false').toLowerCase() === 'true',
    todaysSpecial: (row.todaysSpecial || 'false').toLowerCase() === 'true',
    delivery_type: row.delivery_type || '',
    brand: row.brand || '',
    seoTitle: row.seoTitle || '',
    seoDescription: row.seoDescription || '',
    seoKeywords: row.seoKeywords || '',
    slug: row.slug || '',
    mainImage: row.mainImage || '',
    galleryImages: [],
    price: Number(row.price || 0),
    discounted_price: Number(row.discounted_price || 0),
    variants: []
  };

  if (row.galleryImages) {
    const g = row.galleryImages.replace(/^[\[\]"]+|[\[\]"]+$/g, '');
    if (g) payload.galleryImages = g.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (row.variants) {
    try { payload.variants = JSON.parse(row.variants); } catch (e) { /* ignore */ }
  }
  return payload;
}

(async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const run = args.includes('--run');
  const continueOnError = args.includes('--continue-on-error');
  const limit = Number(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 5;
  const apiUrl = args.find(a => a.startsWith('--apiUrl='))?.split('=')[1] || process.env.API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = args.find(a => a.startsWith('--token='))?.split('=')[1] || process.env.IMPORT_TOKEN || process.env.API_TOKEN;
  const failuresPath = require('path').join(dataDir, 'reports', 'import-failures.json');

  const products = readCsv(productsCsv);
  console.log(`Products in CSV: ${products.length}`);

  for (let i = 0; i < Math.min(limit, products.length); i++) {
    const p = products[i];
    const payload = buildPayload(p);
    console.log('Sample payload for row', i + 1, ':');
    console.log(JSON.stringify(payload, null, 2));
  }
  if (dry && !run) {
    console.log('\nDry-run finished. No network requests were made.');
    return;
  }

  if (run) {
    if (!apiUrl) return console.error('Missing --apiUrl or API_URL/NEXT_PUBLIC_API_BASE_URL env var. Aborting.');
    if (!token) return console.error('Missing --token or IMPORT_TOKEN/API_TOKEN env var. Aborting.');

    console.log('\nStarting real import run (dry flag ignored).');
    const reportDir = require('path').join(dataDir, 'reports');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
    const failures = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const payload = buildPayload(p);
      const endpoint = apiUrl.replace(/\/+$/, '') + '/admin/products';

      // retry logic
      let attempts = 0;
      let success = false;
      let lastErr = null;
      while (attempts < 3 && !success) {
        attempts++;
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            success = true;
            break;
          } else {
            const text = await res.text();
            lastErr = { status: res.status, body: text };
            // retry for server errors
            if (res.status >= 500) {
              await new Promise(r => setTimeout(r, 500 * attempts));
              continue;
            } else {
              break;
            }
          }
        } catch (err) {
          lastErr = { error: err.message || String(err) };
          await new Promise(r => setTimeout(r, 500 * attempts));
        }
      }

      if (!success) {
        failures.push({ index: i + 1, sku: p.sku, slug: p.slug, error: lastErr });
        console.error(`Row ${i + 1} failed:`, lastErr);
        if (!continueOnError) {
          fs.writeFileSync(failuresPath, JSON.stringify({ failures, timestamp: new Date().toISOString() }, null, 2));
          console.log(`Failures written to ${failuresPath}`);
          return process.exit(1);
        }
      } else {
        if ((i + 1) % 50 === 0) console.log(`Imported ${i + 1} / ${products.length}`);
      }
    }

    fs.writeFileSync(failuresPath, JSON.stringify({ failures, timestamp: new Date().toISOString() }, null, 2));
    console.log('\nImport run finished. Failures written to', failuresPath);
  }
})();
