#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const repoRoot = path.resolve(__dirname, '..');
const dataDir = path.join(repoRoot, 'src', 'data');
const reportsDir = path.join(dataDir, 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const inPath = fs.existsSync(path.join(dataDir, 'products.fixed.final.csv')) ? path.join(dataDir, 'products.fixed.final.csv') : path.join(dataDir, 'products.fixed.csv');
if (!fs.existsSync(inPath)) { console.error('Missing', inPath); process.exit(1); }

const raw = fs.readFileSync(inPath, 'utf8');
const rows = parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });

function normalize(s) {
  return (s || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

const categories = new Set();
const subcategories = new Set();
const subsubcategories = new Set();

rows.forEach(r => {
  categories.add((r.category_id || r.category || '').toString().trim());
  subcategories.add((r.subcategory_id || r.subcategory || '').toString().trim());
  subsubcategories.add((r.subsubcategory_id || r.subsubcategory || '').toString().trim());
});

const uniq = {
  categories: Array.from(categories).filter(Boolean).sort(),
  subcategories: Array.from(subcategories).filter(Boolean).sort(),
  subsubcategories: Array.from(subsubcategories).filter(Boolean).sort(),
};

const args = process.argv.slice(2);
const apiUrl = args.find(a => a.startsWith('--apiUrl=')) ? args.find(a => a.startsWith('--apiUrl=')).split('=')[1] : null;
const token = args.find(a => a.startsWith('--token=')) ? args.find(a => a.startsWith('--token=')).split('=')[1] : null;

const reportPath = path.join(reportsDir, 'name-to-id-report.json');

async function fetchList(endpoint) {
  const url = apiUrl.replace(/\/+$/,'') + endpoint;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json();
}

async function run() {
  if (!apiUrl || !token) {
    fs.writeFileSync(reportPath, JSON.stringify({ mode: 'offline', uniq }, null, 2), 'utf8');
    console.log('No API credentials provided. Wrote name report to', reportPath);
    console.log('Provide --apiUrl and --token to map names to IDs automatically.');
    return;
  }

  console.log('Fetching categories/subcategories/subsubcategories from API...');
  try {
    const cats = await fetchList('/admin/categories');
    const subs = await fetchList('/admin/subcategories');
    const subs2 = await fetchList('/admin/subsubcategories');

    // Build name->id maps by normalized name
    const mapByName = (arr, nameField='name') => {
      const m = {};
      (arr || []).forEach(item => {
        const n = normalize(item[nameField] || item.title || item.name);
        if (!m[n]) m[n] = item.id || item._id || item.id;
      });
      return m;
    };

    const catMap = mapByName(cats, 'name');
    const subMap = mapByName(subs, 'name');
    const subsubMap = mapByName(subs2, 'name');

    const unmatched = { categories: [], subcategories: [], subsubcategories: [] };
    const mapped = { categories: {}, subcategories: {}, subsubcategories: {} };

    uniq.categories.forEach(n => {
      const key = normalize(n);
      if (catMap[key]) mapped.categories[n] = catMap[key]; else unmatched.categories.push(n);
    });
    uniq.subcategories.forEach(n => {
      const key = normalize(n);
      if (subMap[key]) mapped.subcategories[n] = subMap[key]; else unmatched.subcategories.push(n);
    });
    uniq.subsubcategories.forEach(n => {
      const key = normalize(n);
      if (subsubMap[key]) mapped.subsubcategories[n] = subsubMap[key]; else unmatched.subsubcategories.push(n);
    });

    const report = { mode: 'api', mapped, unmatched };
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log('Wrote mapping report to', reportPath);

    // If everything mapped, produce products.fixed.with-ids.csv
    const allMapped = Object.keys(mapped.categories).length === uniq.categories.length && Object.keys(mapped.subcategories).length === uniq.subcategories.length && Object.keys(mapped.subsubcategories).length === uniq.subsubcategories.length;
    if (!allMapped) {
      console.log('Not all names matched to IDs. Fix unmatched entries and re-run.');
      return;
    }

    // produce CSV with replaced IDs
    const header = raw.split(/\r?\n/)[0];
    const outLines = [header];
    rows.forEach(r => {
      const rr = Object.assign({}, r);
      const catName = (r.category_id || r.category || '');
      const subName = (r.subcategory_id || r.subcategory || '');
      const subsubName = (r.subsubcategory_id || r.subsubcategory || '');
      rr.category_id = mapped.categories[catName] || rr.category_id;
      rr.subcategory_id = mapped.subcategories[subName] || rr.subcategory_id;
      rr.subsubcategory_id = mapped.subsubcategories[subsubName] || rr.subsubcategory_id;
      // write line respecting simple CSV
      const vals = header.split(',').map(k => {
        const v = rr[k] !== undefined ? rr[k] : '';
        if (/[",\n]/.test(v)) return '"' + String(v).replace(/"/g,'""') + '"';
        return String(v);
      });
      outLines.push(vals.join(','));
    });
    const outPath = path.join(dataDir, 'products.fixed.with-ids.csv');
    fs.writeFileSync(outPath, outLines.join('\n'), 'utf8');
    console.log('Wrote', outPath);

  } catch (err) {
    console.error('API error:', err.message || err);
  }
}

run();
