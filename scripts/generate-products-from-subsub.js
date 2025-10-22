const fs = require('fs');
const path = require('path');

const SUBSUB_CSV = path.join(__dirname, '..', 'src', 'data', 'subsubcategories_template.csv');
const OUT_CSV = path.join(__dirname, '..', 'src', 'data', 'products.csv');
const MAIN_DIR = path.join(__dirname, '..', 'src', 'data', 'product_images', 'main');
const GALLERY_DIR = path.join(__dirname, '..', 'src', 'data', 'product_images', 'gallery');

function splitCsvLine(line) {
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; cur += ch; continue; }
    if (ch === ',' && !inQuotes) { parts.push(trimQuotes(cur)); cur = ''; continue; }
    cur += ch;
  }
  parts.push(trimQuotes(cur));
  return parts;
}
function trimQuotes(s){ if(!s) return ''; let t = s.trim(); if(t.startsWith('"') && t.endsWith('"')) t = t.slice(1,-1); return t; }

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function createPlaceholder(p){ if(fs.existsSync(p)) return false; const png1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==','base64'); fs.writeFileSync(p,png1x1); return true; }

const subtxt = fs.readFileSync(SUBSUB_CSV,'utf8');
const lines = subtxt.split(/\r?\n/).slice(1).filter(Boolean);

ensureDir(MAIN_DIR); ensureDir(GALLERY_DIR);

const header = ['name','description','shortDescription','sku','stock','category','subcategory','subsubcategory','status','featured','newArrival','todaysSpecial','delivery_type','brand','air_purifying','pet_friendly','seoTitle','seoDescription','seoKeywords','slug','mainImage','galleryImages','imagePersonalization','textPersonalization','features','badges','price','discounted_price','variants'];

const out = [header.join(',')];
let count = 0;
for(const l of lines){
  const cols = splitCsvLine(l);
  const category = trimQuotes(cols[0]||'');
  const subcategory = trimQuotes(cols[1]||'');
  const name = trimQuotes(cols[2]||`Product ${count+1}`);
  const slug = (name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'').replace(/^-+|-+$/g,'');
  const sku = slug + '-' + String(count+1).padStart(3,'0');
  // images
  const mainName = `${slug}.jpg`;
  const galleryBase = `${slug}-g`;
  const galleryList = [`${galleryBase}1.jpg`,`${galleryBase}2.jpg`];
  createPlaceholder(path.join(MAIN_DIR, mainName));
  createPlaceholder(path.join(GALLERY_DIR, galleryList[0]));
  createPlaceholder(path.join(GALLERY_DIR, galleryList[1]));
  const variants = JSON.stringify([{ label: 'Default', price: '499', originalPrice: '399', isDefault: true, weight: '1kg', serves: '8' }]).replace(/"/g,'"');
  const row = [
    name,
    `${name} description`,
    `Short for ${name}`,
    sku,
    '100',
    category,
    subcategory,
    name,
    'TRUE','FALSE','FALSE','FALSE','same_day','BrandA','FALSE','FALSE',
    `${name} SEO Title`,`${name} SEO Desc`,`${name} keywords`,slug,mainName,`[${galleryList.join(',')}]`,'TRUE','TRUE','Premium','Featured',
    '499','399',`"${variants}"`
  ];
  // escape commas/quotes
  const esc = row.map(v => { if(String(v).includes(',')||String(v).includes('"')) return '"'+String(v).replace(/"/g,'""')+'"'; return v; });
  out.push(esc.join(','));
  count++;
}

fs.writeFileSync(OUT_CSV, out.join('\n'));
console.log('Generated products for', count, 'subsubcategories.');
