const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const xlsx = require('xlsx');

const workspace = path.resolve(__dirname, '..');
const canonicalCsv = path.join(workspace, 'src', 'data', 'products.fixed.canonical.csv');
const readyCsv = path.join(workspace, 'src', 'data', 'products.fixed.ready.csv');
const mappingTemplate = path.join(workspace, 'src', 'data', 'reports', 'name-to-id-mapping-template.csv');
const suggestions = path.join(workspace, 'src', 'data', 'reports', 'name-to-id-suggested-mapping.csv');
const outXlsx = path.join(workspace, 'src', 'data', 'products.final.upload.xlsx');

async function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return await csv({trim:true}).fromFile(file);
  } catch (e) {
    console.error('Failed to parse', file, e.message);
    return [];
  }
}

(async function main(){
  const productsFile = fs.existsSync(canonicalCsv) ? canonicalCsv : readyCsv;
  console.log('Using products source:', productsFile);
  const products = await readCsv(productsFile);
  if (products.length === 0) {
    console.error('No products found to write. Aborting.');
    process.exit(1);
  }

  // Ensure ID columns exist (blank if missing)
  const augmented = products.map(p => {
    return Object.assign({}, p, {
      category_id: p.category_id || '',
      subcategory_id: p.subcategory_id || '',
      subsubcategory_id: p.subsubcategory_id || ''
    });
  });

  // Prepare sheet data preserving column order from CSV header if possible
  const headers = Object.keys(augmented[0]);
  // But ensure id columns are present at the end for clarity
  const ensureCols = [...headers.filter(h=>!['category_id','subcategory_id','subsubcategory_id'].includes(h)), 'category_id','subcategory_id','subsubcategory_id'];

  const sheetData = [ensureCols];
  augmented.forEach(row => {
    sheetData.push(ensureCols.map(h => row[h] === undefined || row[h] === null ? '' : row[h]));
  });

  const wb = xlsx.utils.book_new();
  const prodSheet = xlsx.utils.aoa_to_sheet(sheetData);
  xlsx.utils.book_append_sheet(wb, prodSheet, 'Products');

  // Add mapping template sheet if present
  const mappingRows = await readCsv(mappingTemplate);
  if (mappingRows.length) {
    const mapHeaders = Object.keys(mappingRows[0]);
    const mapAoa = [mapHeaders];
    mappingRows.forEach(r => mapAoa.push(mapHeaders.map(h => r[h] || '')));
    const mapSheet = xlsx.utils.aoa_to_sheet(mapAoa);
    xlsx.utils.book_append_sheet(wb, mapSheet, 'MappingTemplate');
  }

  // Add suggestions sheet if present
  const suggRows = await readCsv(suggestions);
  if (suggRows.length) {
    const sHeaders = Object.keys(suggRows[0]);
    const sAoa = [sHeaders];
    suggRows.forEach(r => sAoa.push(sHeaders.map(h => r[h] || '')));
    const sSheet = xlsx.utils.aoa_to_sheet(sAoa);
    xlsx.utils.book_append_sheet(wb, sSheet, 'Suggestions');
  }

  // Add an Instructions sheet
  const instructions = [
    ['Instructions'],
    ['1. Fill numeric IDs (category_id, subcategory_id, subsubcategory_id) in the MappingTemplate sheet.'],
    ['2. If you do not have IDs, use the Suggestions sheet to copy canonical names to MappingTemplate and then fill IDs later.'],
    ['3. After filling IDs, re-save this XLSX or export the Products sheet as CSV and upload via the Next.js product import.'],
    ['4. If you want me to map names→IDs automatically, provide API base URL and admin token and I will run a dry-run import to show validation errors.']
  ];
  const instSheet = xlsx.utils.aoa_to_sheet(instructions);
  xlsx.utils.book_append_sheet(wb, instSheet, 'Instructions');

  xlsx.writeFile(wb, outXlsx);
  console.log('Wrote final upload XLSX:', outXlsx);
})();
