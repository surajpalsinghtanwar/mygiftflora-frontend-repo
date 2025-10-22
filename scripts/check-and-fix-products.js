const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { PNG } = require('pngjs');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src', 'data');
const productsCsv = path.join(dataDir, 'products.csv');
const subcatsCsv = path.join(dataDir, 'subcategories_template.csv');
const subsubcatsCsv = path.join(dataDir, 'subsubcategories_template.csv');

const mainImgDir = path.join(dataDir, 'product_images', 'main');
const galleryImgDir = path.join(dataDir, 'product_images', 'gallery');
const reportDir = path.join(dataDir, 'reports');
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

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
        // handle escaped double quotes
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip the escaped quote
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

  // find header line
  let headerIdx = 0;
  while (headerIdx < lines.length && lines[headerIdx].trim() === '') headerIdx++;
  if (headerIdx >= lines.length) return [];
  const headers = parseLine(lines[headerIdx]);
  const records = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    let acc = lines[i];
    // if quotes are unbalanced, join next lines until balanced
    let quoteCount = (acc.match(/"/g) || []).length;
    while (quoteCount % 2 === 1 && i + 1 < lines.length) {
      i++;
      acc += '\n' + lines[i];
      quoteCount = (acc.match(/"/g) || []).length;
    }
    const fields = parseLine(acc);
    // pad or trim fields to header length
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

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writePlaceholderPng(filePath, label) {
  // create a small 16x16 PNG with a single color and optional label (not embedded)
  const png = new PNG({ width: 16, height: 16 });
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = (16 * y + x) << 2;
      png.data[idx] = 200; // R
      png.data[idx+1] = 200; // G
      png.data[idx+2] = 200; // B
      png.data[idx+3] = 255; // A
    }
  }
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
}

(async () => {
  console.log('Reading CSV files...');
  const products = readCsv(productsCsv);
  const subcats = readCsv(subcatsCsv);
  const subsubcats = readCsv(subsubcatsCsv);

  // Build sets for valid names
  const validSubcats = new Set(subcats.map(s => (s.name || s['name']).trim()));
  const validSubsubcats = new Set(subsubcats.map(s => (s.name || s['name']).trim()));

  // Counts
  const countsBySubcat = {};
  const countsBySubsubcat = {};
  const mismatched = [];

  // Collect referenced image filenames
  const mainImages = new Set();
  const galleryImages = new Set();

  for (const p of products) {
    const subcat = (p.subcategory || p.subcategory || '').trim();
    const subsub = (p.subsubcategory || p.subsubcategory || '').trim();

    countsBySubcat[subcat] = (countsBySubcat[subcat] || 0) + 1;
    countsBySubsubcat[subsub] = (countsBySubsubcat[subsub] || 0) + 1;

    if (!validSubcats.has(subcat)) {
      mismatched.push({ row: p, type: 'subcategory', value: subcat });
    }
    if (!validSubsubcats.has(subsub)) {
      mismatched.push({ row: p, type: 'subsubcategory', value: subsub });
    }

    const main = (p.mainImage || '').trim();
    if (main) mainImages.add(main.replace(/^"|"$/g, ''));

    const galleryRaw = (p.galleryImages || '').trim();
    // gallery is like [img1,img2]
    const g = galleryRaw.replace(/^[\[\]"]+|[\[\]"]+$/g, '');
    if (g) {
      g.split(',').map(s => s.trim()).forEach(fn => { if (fn) galleryImages.add(fn); });
    }
  }

  // Identify under/over populated subcategories
  const subcatProblems = [];
  for (const sc of Object.keys(countsBySubcat)) {
    const c = countsBySubcat[sc];
    if (c < 5 || c > 10) subcatProblems.push({ subcategory: sc, count: c });
  }

  const subsubProblems = [];
  for (const ssc of Object.keys(countsBySubsubcat)) {
    const c = countsBySubsubcat[ssc];
    if (c < 1 || c > 2) subsubProblems.push({ subsubcategory: ssc, count: c });
  }

  ensureDir(mainImgDir);
  ensureDir(galleryImgDir);

  const missingMain = [];
  for (const fn of mainImages) {
    const pth = path.join(mainImgDir, fn);
    if (!fs.existsSync(pth)) {
      missingMain.push(fn);
      writePlaceholderPng(pth, fn);
    }
  }

  const missingGallery = [];
  for (const fn of galleryImages) {
    const pth = path.join(galleryImgDir, fn);
    if (!fs.existsSync(pth)) {
      missingGallery.push(fn);
      writePlaceholderPng(pth, fn);
    }
  }

  const report = {
    totalProducts: products.length,
    subcategoryCounts: countsBySubcat,
    subsubcategoryCounts: countsBySubsubcat,
    subcategoryProblems: subcatProblems,
    subsubcategoryProblems: subsubProblems,
    mismatchedNames: mismatched,
    missingMainImagesCreated: missingMain,
    missingGalleryImagesCreated: missingGallery,
    timestamp: new Date().toISOString(),
  };

  const outPath = path.join(reportDir, 'products-image-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('Report written to', outPath);
  console.log('Summary:');
  console.log(`Total products: ${products.length}`);
  console.log(`Subcategories with <5 or >10 products: ${subcatProblems.length}`);
  console.log(`Subsubcategories with unusual counts: ${subsubProblems.length}`);
  console.log(`Mismatched name references: ${mismatched.length}`);
  console.log(`Placeholders created for main images: ${missingMain.length}`);
  console.log(`Placeholders created for gallery images: ${missingGallery.length}`);
})();
