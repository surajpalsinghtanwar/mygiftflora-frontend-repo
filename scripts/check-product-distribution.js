const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

async function loadCsv(file) {
  const p = path.resolve(__dirname, '..', 'src', 'data', file);
  if (!fs.existsSync(p)) {
    console.error('Missing file:', p);
    return [];
  }
  return csv().fromFile(p);
}

function normalizeName(s) {
  if (!s && s !== '') return '';
  return String(s).trim();
}

(async () => {
  const subcats = await loadCsv('subcategories_template.csv');
  const subsub = await loadCsv('subsubcategories_template.csv');
  const products = await loadCsv('products.csv');

  const subcatNames = new Set(subcats.map(r => normalizeName(r.name)));
  const subsubTuples = new Set(subsub.map(r => `${normalizeName(r.subcategory_name)}|||${normalizeName(r.name)}`));

  const countsBySubcat = {};
  const countsBySubsub = {};
  const mismatches = [];

  products.forEach((p, idx) => {
    const rowNum = idx + 2; // account for header
    const subcategory = normalizeName(p.subcategory);
    const subsubcategory = normalizeName(p.subsubcategory);

    if (!subcategory) {
      mismatches.push({ row: rowNum, reason: 'missing subcategory', product: p });
    }

    // count subcategory
    countsBySubcat[subcategory] = (countsBySubcat[subcategory] || 0) + 1;

    // check subcategory presence
    if (subcategory && !subcatNames.has(subcategory)) {
      mismatches.push({ row: rowNum, reason: `unknown subcategory: "${subcategory}"`, product: p });
    }

    // count subsubcategory
    const key = `${subcategory}|||${subsubcategory}`;
    countsBySubsub[key] = (countsBySubsub[key] || 0) + 1;

    if (subsubcategory && !subsubTuples.has(key)) {
      mismatches.push({ row: rowNum, reason: `unknown subsubcategory for ${subcategory}: "${subsubcategory}"`, product: p });
    }
  });

  // Report
  console.log('Products analyzed:', products.length);
  console.log('\nSubcategory counts:');
  const subcatEntries = Object.entries(countsBySubcat).sort((a,b) => b[1]-a[1]);
  subcatEntries.forEach(([name,count]) => console.log(`  ${name || '<empty>'}: ${count}`));

  console.log('\nSubsubcategory counts (shown as "subcategory -> subsubcategory: count"):');
  const subsubEntries = Object.entries(countsBySubsub).sort((a,b) => b[1]-a[1]);
  subsubEntries.forEach(([k,count]) => {
    const [sc, ssc] = k.split('|||');
    console.log(`  ${sc} -> ${ssc || '<empty>'}: ${count}`);
  });

  console.log('\nSubcategories with fewer than 5 or more than 10 products (expect 5-10):');
  subcatEntries.forEach(([name,count]) => {
    if (count < 5 || count > 10) {
      console.log(`  ${name || '<empty>'}: ${count}`);
    }
  });

  console.log('\nMismatches / unknown names (sample up to 50):');
  if (mismatches.length === 0) {
    console.log('  None');
  } else {
    mismatches.slice(0,50).forEach(m => {
      console.log(`  Row ${m.row}: ${m.reason} -> product name: "${m.product.name || ''}" (category: "${m.product.category}", subcategory: "${m.product.subcategory}", subsubcategory: "${m.product.subsubcategory}")`);
    });
    if (mismatches.length > 50) console.log(`  ...and ${mismatches.length - 50} more`);
  }

  // Save full report to file
  const out = {
    productsAnalyzed: products.length,
    subcategoryCounts: countsBySubcat,
    subsubcategoryCounts: countsBySubsub,
    mismatches
  };
  fs.writeFileSync(path.resolve(__dirname, 'product-distribution-report.json'), JSON.stringify(out, null, 2));
  console.log('\nWrote report: scripts/product-distribution-report.json');
})();
