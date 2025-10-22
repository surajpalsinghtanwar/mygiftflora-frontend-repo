const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const xlsx = require('xlsx');

const workspace = path.resolve(__dirname, '..');
const canonicalCsv = path.join(workspace, 'src', 'data', 'products.fixed.canonical.csv');
const readyCsv = path.join(workspace, 'src', 'data', 'products.fixed.ready.csv');
const outCsv = path.join(workspace, 'src', 'data', 'products.names-only.csv');
const outXlsx = path.join(workspace, 'src', 'data', 'products.names-only.xlsx');

async function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  try { return await csv({trim:true}).fromFile(file); } catch (e) { return []; }
}

(async function main(){
  const source = fs.existsSync(canonicalCsv) ? canonicalCsv : readyCsv;
  console.log('Using source for names-only:', source);
  const rows = await readCsv(source);
  if (!rows.length) {
    console.error('No rows found in source CSV. Aborting.');
    process.exit(1);
  }

  // Determine headers from source keeping original order but dropping id fields and category_name helper fields
  const srcHeaders = Object.keys(rows[0]);
  const drop = new Set(['category_id','subcategory_id','subsubcategory_id','category_name','subcategory_name','subsubcategory_name']);
  const headers = srcHeaders.filter(h => !drop.has(h));

  // Ensure category/subcategory/subsubcategory names are present and canonical
  if (!headers.includes('category') || !headers.includes('subcategory') || !headers.includes('subsubcategory')) {
    console.error('Source missing one of required name columns: category, subcategory, subsubcategory');
    process.exit(1);
  }

  // Write CSV
  const csvLines = [headers.join(',')];
  rows.forEach(r => {
    const vals = headers.map(h => {
      const v = r[h] === undefined || r[h] === null ? '' : String(r[h]);
      if (v.includes(',') || v.includes('\n') || v.includes('"')) return '"' + v.replace(/"/g,'""') + '"';
      return v;
    });
    csvLines.push(vals.join(','));
  });
  fs.writeFileSync(outCsv, csvLines.join('\n'));

  // Write XLSX with single Products sheet
  const aoa = [headers];
  rows.forEach(r => aoa.push(headers.map(h => r[h] === undefined || r[h] === null ? '' : r[h])));
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(aoa);
  xlsx.utils.book_append_sheet(wb, ws, 'Products');
  xlsx.writeFile(wb, outXlsx);

  console.log('Wrote names-only CSV:', outCsv);
  console.log('Wrote names-only XLSX:', outXlsx);
})();
