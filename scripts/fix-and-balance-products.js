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
    // fallback simple parser for very small/simple template CSVs
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

function normalize(s) {
  if (s == null) return '';
  return s
    .toString()
    .trim()
    .replace(/[\u2018\u2019\u201c\u201d]/g, '"')
    .replace(/[^a-z0-9 ]+/gi, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const subcatsTemplatePath = path.join(dataDir, 'subcategories_template.csv');
const subsubTemplatePath = path.join(dataDir, 'subsubcategories_template.csv');
const productsPath = path.join(dataDir, 'products.trimmed.csv');
const outPath = path.join(dataDir, 'products.fixed.csv');
const reportPath = path.join(reportsDir, 'products-fix-report.json');

if (!fs.existsSync(productsPath)) {
  console.error('products.trimmed.csv not found at', productsPath);
  process.exit(1);
}

const subcats = fs.existsSync(subcatsTemplatePath) ? readCSV(subcatsTemplatePath) : [];
const subsubs = fs.existsSync(subsubTemplatePath) ? readCSV(subsubTemplatePath) : [];

// Build canonical maps
const categories = new Set();
const subcatsByCategory = {}; // category -> Set(subcategory)
const subsubsByCatSub = {}; // category||'|'||subcategory -> Set(subsubcategory)

subcats.forEach(r => {
  const c = r.category_name || r.category || '';
  const s = r.name || r.subcategory_name || r.subcategory || '';
  const cat = c.trim();
  const sc = s.trim();
  categories.add(cat);
  subcatsByCategory[cat] = subcatsByCategory[cat] || new Set();
  if (sc) subcatsByCategory[cat].add(sc);
});

subsubs.forEach(r => {
  const c = r.category_name || r.category || '';
  const s = r.subcategory_name || r.subcategory || '';
  const n = r.name || r.subsubcategory || '';
  const key = (c || '') + '|' + (s || '');
  subsubsByCatSub[key] = subsubsByCatSub[key] || new Set();
  if (n) subsubsByCatSub[key].add(n);
  categories.add(c);
  subcatsByCategory[c] = subcatsByCategory[c] || new Set();
  if (s) subcatsByCategory[c].add(s);
});

// Flatten canonical names for fuzzy matching
const canonicalCategories = Array.from(categories);

function findCanonicalCategory(input) {
  const n = normalize(input);
  // exact
  for (const c of canonicalCategories) if (normalize(c) === n) return c;
  // substring
  for (const c of canonicalCategories) if (normalize(c).includes(n) || n.includes(normalize(c))) return c;
  // startsWith
  for (const c of canonicalCategories) if (normalize(c).startsWith(n) || n.startsWith(normalize(c))) return c;
  return null;
}

function findCanonicalSubcategory(cat, input) {
  const arr = subcatsByCategory[cat] ? Array.from(subcatsByCategory[cat]) : [];
  const n = normalize(input);
  for (const s of arr) if (normalize(s) === n) return s;
  for (const s of arr) if (normalize(s).includes(n) || n.includes(normalize(s))) return s;
  for (const s of arr) if (normalize(s).startsWith(n) || n.startsWith(normalize(s))) return s;
  return null;
}

function findCanonicalSubsubcategory(cat, sub, input) {
  const key = (cat || '') + '|' + (sub || '');
  const arr = subsubsByCatSub[key] ? Array.from(subsubsByCatSub[key]) : [];
  const n = normalize(input);
  for (const s of arr) if (normalize(s) === n) return s;
  for (const s of arr) if (normalize(s).includes(n) || n.includes(normalize(s))) return s;
  for (const s of arr) if (normalize(s).startsWith(n) || n.startsWith(normalize(s))) return s;
  return null;
}

const products = readCSV(productsPath);
const headerLine = fs.readFileSync(productsPath, 'utf8').split('\n')[0];

const report = {
  totalRows: products.length,
  corrected: [],
  unmapped: [],
  countsBefore: {},
  countsAfter: {},
  clonesAdded: 0,
};

function keyOf(r) {
  return `${r.category}|||${r.subcategory}|||${r.subsubcategory}`;
}

// Count before
products.forEach((r) => {
  const k = keyOf(r);
  report.countsBefore[k] = (report.countsBefore[k] || 0) + 1;
});

// Normalize/correct names
const fixed = products.map((r, idx) => {
  const orig = { category: r.category, subcategory: r.subcategory, subsubcategory: r.subsubcategory };
  let cat = r.category || '';
  let sub = r.subcategory || '';
  let subsub = r.subsubcategory || '';

  const matchedCat = findCanonicalCategory(cat) || findCanonicalCategory(sub) || findCanonicalCategory(subsub);
  if (matchedCat) cat = matchedCat;

  if (cat && sub) {
    const matchedSub = findCanonicalSubcategory(cat, sub);
    if (matchedSub) sub = matchedSub;
  }

  if (cat && sub && subsub) {
    const matchedSubSub = findCanonicalSubsubcategory(cat, sub, subsub);
    if (matchedSubSub) subsub = matchedSubSub;
  }

  // If still missing subsubcategory but templates contain only one for this subcategory, pick that
  const key = (cat || '') + '|' + (sub || '');
  if ((!subsub || !subsub.trim()) && subsubsByCatSub[key]) {
    const arr = Array.from(subsubsByCatSub[key]);
    if (arr.length === 1) subsub = arr[0];
  }

  // Record corrections
  if (orig.category !== cat || orig.subcategory !== sub || orig.subsubcategory !== subsub) {
    report.corrected.push({ row: idx + 2, original: orig, corrected: { category: cat, subcategory: sub, subsubcategory: subsub } });
  }

  if (!cat || !sub || !subsub) {
    report.unmapped.push({ row: idx + 2, original: orig });
  }

  return Object.assign({}, r, { category: cat, subcategory: sub, subsubcategory: subsub });
});

// Re-count after normalization
fixed.forEach((r) => {
  const k = keyOf(r);
  report.countsAfter[k] = (report.countsAfter[k] || 0) + 1;
});

// Build map of products per template subsubcategory (ensure every template entry is considered)
const allTemplateKeys = [];
Object.keys(subsubsByCatSub).forEach(k => {
  Array.from(subsubsByCatSub[k]).forEach(subsubName => {
    allTemplateKeys.push({ catSubKey: k, subsubcategory: subsubName, category: k.split('|')[0], subcategory: k.split('|')[1] });
  });
});

// Map existing fixed products by key
const mapByKey = {};
fixed.forEach((r, i) => {
  const k = keyOf(r);
  mapByKey[k] = mapByKey[k] || [];
  mapByKey[k].push({ row: r, idx: i });
});

let clonesAdded = 0;
const MIN_PER_SUBSUB = 8;

// Helper to clone a product row, ensuring unique sku and slug
function makeClone(origRow, suffixIndex) {
  const newRow = Object.assign({}, origRow);
  // modify sku
  const skuBase = (origRow.sku || '').replace(/-\d+$/, '');
  newRow.sku = skuBase + '-' + (suffixIndex);
  // modify slug
  const slugBase = (origRow.slug || '').replace(/-\d+$/, '');
  newRow.slug = slugBase + '-' + (suffixIndex);
  // modify name to avoid exact duplicates
  newRow.name = (origRow.name || '') + ' (copy ' + suffixIndex + ')';
  return newRow;
}

// For every template subsubcategory, ensure at least MIN_PER_SUBSUB products
for (const tmpl of allTemplateKeys) {
  const cat = tmpl.category;
  const sub = tmpl.subcategory;
  const subsub = tmpl.subsubcategory;
  const k = `${cat}|||${sub}|||${subsub}`;
  const existing = mapByKey[k] || [];
  if (existing.length >= MIN_PER_SUBSUB) continue;
  // Need to add clones
  const need = MIN_PER_SUBSUB - existing.length;
  // Choose a source to clone: prefer existing in same key; else any in same subcategory; else any in same category; else any product at all
  let sources = existing.map(e => e.row);
  if (sources.length === 0) {
    // same subcategory
    const fallbackKeyPrefix = `${cat}|||${sub}|||`;
    for (const mk in mapByKey) {
      if (mk.startsWith(fallbackKeyPrefix) && mapByKey[mk].length > 0) {
        sources = mapByKey[mk].map(e => e.row);
        break;
      }
    }
  }
  if (sources.length === 0) {
    // same category
    const fallbackKeyPrefix = `${cat}|||`;
    for (const mk in mapByKey) {
      if (mk.startsWith(fallbackKeyPrefix) && mapByKey[mk].length > 0) {
        sources = mapByKey[mk].map(e => e.row);
        break;
      }
    }
  }
  if (sources.length === 0) {
    // any product
    sources = fixed.map(r => r);
  }

  // If still empty, skip
  if (sources.length === 0) continue;

  for (let i = 0; i < need; i++) {
    const source = sources[i % sources.length];
    const cloneIdx = ++clonesAdded;
    const clone = makeClone(source, 'auto' + cloneIdx);
    // set canonical names
    clone.category = cat;
    clone.subcategory = sub;
    clone.subsubcategory = subsub;
    // append to fixed and map
    fixed.push(clone);
    mapByKey[k] = mapByKey[k] || [];
    mapByKey[k].push({ row: clone, idx: fixed.length - 1 });
  }
}

report.clonesAdded = clonesAdded;

// Write out CSV
const keys = headerLine.split(',');
const outLines = [headerLine];
for (const r of fixed) {
  const vals = keys.map(k => csvEscape(r[k]));
  outLines.push(vals.join(','));
}
fs.writeFileSync(outPath, outLines.join('\n'), 'utf8');

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log('Wrote', outPath);
console.log('Report written to', reportPath);
