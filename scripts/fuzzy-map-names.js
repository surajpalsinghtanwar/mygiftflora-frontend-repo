const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const workspace = path.resolve(__dirname, '..');
const readyCsv = path.join(workspace, 'src', 'data', 'products.fixed.ready.csv');
const nameReport = path.join(workspace, 'src', 'data', 'reports', 'name-to-id-report.json');
const suggestedCsv = path.join(workspace, 'src', 'data', 'reports', 'name-to-id-suggested-mapping.csv');
const canonicalProducts = path.join(workspace, 'src', 'data', 'products.fixed.canonical.csv');
const reportJson = path.join(workspace, 'src', 'data', 'reports', 'fuzzy-mapping-report.json');

function tokens(s) {
  if (!s) return [];
  return s.toString().toLowerCase().replace(/[\W_]+/g, ' ').trim().split(/\s+/).filter(Boolean);
}

function tokenJaccard(a, b) {
  const ta = new Set(tokens(a));
  const tb = new Set(tokens(b));
  if (ta.size === 0 && tb.size === 0) return 1;
  const inter = [...ta].filter(x => tb.has(x)).length;
  const union = new Set([...ta, ...tb]).size;
  return union === 0 ? 0 : inter / union;
}

(async function main(){
  if (!fs.existsSync(readyCsv)) {
    console.error('Ready CSV not found:', readyCsv);
    process.exit(1);
  }
  if (!fs.existsSync(nameReport)) {
    console.error('Name report not found:', nameReport);
    process.exit(1);
  }

  const nameData = JSON.parse(fs.readFileSync(nameReport, 'utf8'));
  const categories = (nameData.uniq && nameData.uniq.categories) || [];
  const subcategories = (nameData.uniq && nameData.uniq.subcategories) || [];
  const subsubcategories = (nameData.uniq && nameData.uniq.subsubcategories) || [];

  const rows = await csv({trim:true}).fromFile(readyCsv);

  const distinct = {categories:new Set(), subcategories:new Set(), subsubcategories:new Set()};
  rows.forEach(r => {
    distinct.categories.add((r.category||'').trim());
    distinct.subcategories.add((r.subcategory||'').trim());
    distinct.subsubcategories.add((r.subsubcategory||'').trim());
  });

  function findBest(name, pool) {
    let best = {cand: '', score: 0};
    for (const p of pool) {
      const s = tokenJaccard(name, p);
      if (s > best.score) { best = {cand: p, score: s}; }
    }
    return best;
  }

  const suggestions = [];

  for (const c of Array.from(distinct.categories).sort()) {
    const best = findBest(c, categories);
    suggestions.push({type:'category', original:c, suggested: best.cand || '', score: best.score});
  }
  for (const s of Array.from(distinct.subcategories).sort()) {
    const best = findBest(s, subcategories);
    suggestions.push({type:'subcategory', original:s, suggested: best.cand || '', score: best.score});
  }
  for (const ss of Array.from(distinct.subsubcategories).sort()) {
    const best = findBest(ss, subsubcategories);
    suggestions.push({type:'subsubcategory', original:ss, suggested: best.cand || '', score: best.score});
  }

  // write suggested mapping CSV
  const header = ['type','original_name','suggested_canonical_name','score'];
  const lines = [header.join(',')];
  suggestions.forEach(s => {
    const row = [s.type, s.original_name, s.suggested, s.score.toFixed(3)];
    const esc = row.map(v=> (v && (v.includes(',')||v.includes('"')||v.includes('\n'))) ? '"'+String(v).replace(/"/g,'""')+'"' : String(v));
    lines.push(esc.join(','));
  });
  fs.writeFileSync(suggestedCsv, lines.join('\n'));

  // create canonicalized products CSV where we replace names with suggested canonical names when score >= 0.6
  const suggestionsMap = new Map();
  suggestions.forEach(s => {
    if (s.suggested && parseFloat(s.score) >= 0.6) {
      suggestionsMap.set(s.type+':'+s.original, s.suggested);
    }
  });

  const outHeader = Object.keys(rows[0]);
  const outLines = [outHeader.join(',')];
  rows.forEach(r => {
    const cat = r.category || '';
    const sub = r.subcategory || '';
    const ssub = r.subsubcategory || '';
    const catC = suggestionsMap.get('category:'+cat) || cat;
    const subC = suggestionsMap.get('subcategory:'+sub) || sub;
    const ssubC = suggestionsMap.get('subsubcategory:'+ssub) || ssub;
    const rowObj = Object.assign({}, r, {category:catC, subcategory:subC, subsubcategory:ssubC});
    const vals = outHeader.map(h => {
      const v = rowObj[h] === undefined || rowObj[h] === null ? '' : String(rowObj[h]);
      if (v.includes(',')||v.includes('\n')||v.includes('"')) return '"'+v.replace(/"/g,'""')+'"';
      return v;
    });
    outLines.push(vals.join(','));
  });
  fs.writeFileSync(canonicalProducts, outLines.join('\n'));

  const report = {
    totalRows: rows.length,
    distinctCounts: {
      categories: Array.from(distinct.categories).length,
      subcategories: Array.from(distinct.subcategories).length,
      subsubcategories: Array.from(distinct.subsubcategories).length
    },
    suggestionsWritten: suggestions.length,
    note: 'Suggested canonical mappings created. Review name-to-id-suggested-mapping.csv and update mapping template or provide API creds to fetch IDs.'
  };
  fs.writeFileSync(reportJson, JSON.stringify(report,null,2));

  console.log('Wrote suggested mapping:', suggestedCsv);
  console.log('Wrote canonical products CSV:', canonicalProducts);
  console.log('Wrote report:', reportJson);
})();
