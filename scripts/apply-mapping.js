const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const workspace = path.resolve(__dirname, '..');
const readyCsv = path.join(workspace, 'src', 'data', 'products.fixed.ready.csv');
const mappingCsv = path.join(workspace, 'src', 'data', 'reports', 'name-to-id-mapping-template.csv');
const outCsv = path.join(workspace, 'src', 'data', 'products.fixed.with-ids.csv');
const reportJson = path.join(workspace, 'src', 'data', 'reports', 'mapping-apply-report.json');

function normalize(s) {
  if (!s && s !== 0) return '';
  return String(s).trim();
}

(async function main(){
  if (!fs.existsSync(readyCsv)) {
    console.error('Ready CSV not found:', readyCsv);
    process.exit(1);
  }

  let mappings = [];
  try {
    mappings = await csv().fromFile(mappingCsv);
  } catch (err) {
    mappings = [];
  }
  // build maps for quick lookup: exact match on names
  const catMap = new Map();
  const subMap = new Map();
  const subsubMap = new Map();
  mappings.forEach(m => {
    const cat = normalize(m.category_name);
    const catId = normalize(m.category_id);
    const sub = normalize(m.subcategory_name);
    const subId = normalize(m.subcategory_id);
    const ssub = normalize(m.subsubcategory_name);
    const ssubId = normalize(m.subsubcategory_id);
    if (cat) catMap.set(cat.toLowerCase(), catId);
    if (sub) subMap.set(sub.toLowerCase(), subId);
    if (ssub) subsubMap.set(ssub.toLowerCase(), ssubId);
  });

  const rows = await csv({trim:true}).fromFile(readyCsv);
  const out = [];
  let unmapped = {categories:new Set(), subcategories:new Set(), subsubcategories:new Set()};

  rows.forEach(r => {
    const category = normalize(r.category);
    const subcategory = normalize(r.subcategory);
    const subsubcategory = normalize(r.subsubcategory);

    const category_id = catMap.get(category.toLowerCase()) || '';
    const subcategory_id = subMap.get(subcategory.toLowerCase()) || '';
    const subsubcategory_id = subsubMap.get(subsubcategory.toLowerCase()) || '';

    if (!category_id) unmapped.categories.add(category);
    if (!subcategory_id) unmapped.subcategories.add(subcategory);
    if (!subsubcategory_id) unmapped.subsubcategories.add(subsubcategory);

    // replace name fields with id fields expected by backend (but keep original names in separate columns)
    const outRow = Object.assign({}, r);
    outRow.category_name = category;
    outRow.subcategory_name = subcategory;
    outRow.subsubcategory_name = subsubcategory;
    outRow.category_id = category_id;
    outRow.subcategory_id = subcategory_id;
    outRow.subsubcategory_id = subsubcategory_id;

    // optional: keep original name columns removed if backend expects ids only
    // delete outRow.category; delete outRow.subcategory; delete outRow.subsubcategory;

    out.push(outRow);
  });

  // write CSV header from out[0] keys
  if (out.length === 0) {
    console.error('No rows parsed from ready CSV');
    process.exit(1);
  }

  const headers = Object.keys(out[0]);
  const lines = [headers.join(',')];
  out.forEach(r => {
    const vals = headers.map(h => {
      const v = r[h] === undefined || r[h] === null ? '' : String(r[h]);
      if (v.includes(',') || v.includes('\n') || v.includes('"')) {
        return '"' + v.replace(/"/g,'""') + '"';
      }
      return v;
    });
    lines.push(vals.join(','));
  });

  fs.writeFileSync(outCsv, lines.join('\n'));

  const report = {
    totalRows: rows.length,
    unmapped: {
      categories: Array.from(unmapped.categories).slice(0,200),
      subcategories: Array.from(unmapped.subcategories).slice(0,200),
      subsubcategories: Array.from(unmapped.subsubcategories).slice(0,200)
    },
    note: 'Fill in ids in the mapping template at src/data/reports/name-to-id-mapping-template.csv and re-run this script, or provide API credentials and use scripts/map-names-to-ids.js to fetch IDs automatically.'
  };

  fs.writeFileSync(reportJson, JSON.stringify(report, null, 2));
  console.log('Wrote', outCsv);
  console.log('Wrote report', reportJson);
})();
