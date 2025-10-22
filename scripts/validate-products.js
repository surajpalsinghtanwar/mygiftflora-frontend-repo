const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const workspace = path.resolve(__dirname, '..');
const canonicalCsv = path.join(workspace, 'src', 'data', 'products.fixed.canonical.csv');
const readyCsv = path.join(workspace, 'src', 'data', 'products.fixed.ready.csv');
const outReport = path.join(workspace, 'src', 'data', 'reports', 'validation-report.json');
const mainImgDir = path.join(workspace, 'src', 'data', 'product_images', 'main');
const galleryImgDir = path.join(workspace, 'src', 'data', 'product_images', 'gallery');

function tryParseNumber(v){
  if (v === undefined || v === null || v === '') return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g,''));
  return Number.isFinite(n) ? n : null;
}

function isBooleanLike(v){
  if (v === undefined || v === null) return false;
  const s = String(v).toLowerCase().trim();
  return ['true','false','1','0','yes','no'].includes(s);
}

async function main(){
  const source = fs.existsSync(canonicalCsv) ? canonicalCsv : readyCsv;
  if (!fs.existsSync(source)) {
    console.error('No source CSV found at', source);
    process.exit(1);
  }

  const rows = await csv({trim:true}).fromFile(source);
  const total = rows.length;

  const report = {
    source: source,
    totalRows: total,
    missingRequired: [],
    skuDuplicates: [],
    slugDuplicates: [],
    priceErrors: [],
    stockErrors: [],
    statusValues: {},
    deliveryTypes: {},
    variantErrors: [],
    imageMissing: {main:[], gallery:[]},
    slugFormatIssues: [],
    booleanIssues: [],
    sampleRowsWithProblems: []
  };

  const skuMap = new Map();
  const slugMap = new Map();

  rows.forEach((r, idx) => {
    const line = idx + 2; // approx CSV line (header is 1)
    const issues = [];
    const name = (r.name||'').trim();
    const sku = (r.sku||'').trim();
    const slug = (r.slug||'').trim();
    const category = (r.category||'').trim();
    const subcategory = (r.subcategory||'').trim();
    const subsubcategory = (r.subsubcategory||'').trim();

    // required fields
    if (!name || !sku || !slug || !category || !subcategory || !subsubcategory) {
      report.missingRequired.push({line, name, sku, slug, category, subcategory, subsubcategory});
      issues.push('missing_required');
    }

    // sku uniqueness
    if (sku) {
      const prev = skuMap.get(sku)||[]; prev.push(line); skuMap.set(sku, prev);
    }

    if (slug) {
      const prev = slugMap.get(slug)||[]; prev.push(line); slugMap.set(slug, prev);
    }

    // price
    const price = tryParseNumber(r.price);
    const dprice = tryParseNumber(r.discounted_price);
    if (price === null || price < 0) {
      report.priceErrors.push({line, sku, priceRaw: r.price}); issues.push('price_invalid');
    }
    if (dprice !== null && price !== null && dprice > price) {
      report.priceErrors.push({line, sku, discounted_price: dprice, price}); issues.push('discount_gt_price');
    }

    // stock
    const stock = tryParseNumber(r.stock);
    if (stock === null || !Number.isInteger(stock) || stock < 0) {
      report.stockErrors.push({line, sku, stockRaw: r.stock}); issues.push('stock_invalid');
    }

    // status
    const status = (r.status||'').toString().trim();
    const sKey = status || 'MISSING'; report.statusValues[sKey] = (report.statusValues[sKey]||0) + 1;
    if (!['active','inactive'].includes(status.toLowerCase())) {
      report.booleanIssues.push({line, field:'status', value:status}); issues.push('status_nonstandard');
    }

    // featured/newArrival/todaysSpecial
    ['featured','newArrival','todaysSpecial'].forEach(f => {
      if (r[f] !== undefined && r[f] !== null && String(r[f]).trim() !== '') {
        if (!isBooleanLike(r[f])) {
          report.booleanIssues.push({line, field:f, value: r[f]}); issues.push('boolean_nonstandard');
        }
      }
    });

    // delivery type frequency
    const dt = (r.delivery_type||'').trim(); if (dt) report.deliveryTypes[dt] = (report.deliveryTypes[dt]||0) + 1;

    // variants parse
    if (r.variants) {
      try {
        const v = JSON.parse(r.variants);
        if (!Array.isArray(v)) { report.variantErrors.push({line, sku, reason:'variants-not-array'}); issues.push('variants_not_array'); }
        else {
          v.forEach((vv,i) => {
            if (!vv.label || tryParseNumber(vv.price) === null) {
              report.variantErrors.push({line, sku, index:i, variant: vv}); issues.push('variant_field_missing');
            }
          });
        }
      } catch (e) {
        report.variantErrors.push({line, sku, reason: e.message}); issues.push('variant_json_parse');
      }
    } else {
      report.variantErrors.push({line, sku, reason:'missing_variants'}); issues.push('missing_variants');
    }

    // images
    const mainImg = (r.mainImage||'').trim();
    if (mainImg) {
      const mainPath = path.join(mainImgDir, mainImg);
      if (!fs.existsSync(mainPath)) { report.imageMissing.main.push({line, sku, mainImage: mainImg}); issues.push('main_image_missing'); }
    } else { report.imageMissing.main.push({line, sku, mainImage: mainImg}); issues.push('main_image_missing'); }

    const galleryRaw = (r.galleryImages||'').trim();
    if (galleryRaw) {
      // gallery is like [a,b]
      const cleaned = galleryRaw.replace(/^\s*\[|\]\s*$/g,'');
      const parts = cleaned.split(',').map(s=>s.replace(/"/g,'').trim()).filter(Boolean);
      parts.forEach(g => {
        const gp = path.join(galleryImgDir, g);
        if (!fs.existsSync(gp)) report.imageMissing.gallery.push({line, sku, galleryImage: g});
      });
    } else {
      report.imageMissing.gallery.push({line, sku, galleryImage: ''}); issues.push('gallery_missing');
    }

    // slug format
    if (slug && (/[A-Z\s]/.test(slug) || /__+/.test(slug))) {
      report.slugFormatIssues.push({line, sku, slug}); issues.push('slug_format');
    }

    if (issues.length) {
      report.sampleRowsWithProblems.push({line, sku, slug, issues});
    }
  });

  // collect duplicates
  for (const [sku, lines] of skuMap) if (lines.length > 1) report.skuDuplicates.push({sku, lines});
  for (const [slug, lines] of slugMap) if (lines.length > 1) report.slugDuplicates.push({slug, lines});

  // limit arrays
  ['missingRequired','skuDuplicates','slugDuplicates','priceErrors','stockErrors','variantErrors','imageMissing','slugFormatIssues','booleanIssues','sampleRowsWithProblems'].forEach(k=>{
    if (report[k] && Array.isArray(report[k]) && report[k].length > 200) report[k] = report[k].slice(0,200);
  });

  fs.writeFileSync(outReport, JSON.stringify(report, null, 2));
  console.log('Validation complete. Wrote report to', outReport);
  // print concise summary
  console.log('rows:', report.totalRows,
    'missingRequired:', report.missingRequired.length,
    'skuDuplicates:', report.skuDuplicates.length,
    'slugDuplicates:', report.slugDuplicates.length,
    'priceErrors:', report.priceErrors.length,
    'variantErrors:', report.variantErrors.length,
    'imageMissing.main:', report.imageMissing.main.length,
    'imageMissing.gallery:', report.imageMissing.gallery.length
  );
}

main().catch(e=>{ console.error(e); process.exit(1); });
