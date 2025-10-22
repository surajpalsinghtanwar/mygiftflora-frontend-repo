const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const uploadReady = path.join(ROOT, 'src', 'data', 'product_images', 'upload_ready');
const mainDir = path.join(uploadReady, 'main');
const galleryDir = path.join(uploadReady, 'gallery');
const reportsDir = path.join(ROOT, 'src', 'data', 'reports');
const namesOnlyCsv = path.join(ROOT, 'src', 'data', 'products.names-only.csv');

function pad(n, width=3){ return n.toString().padStart(width,'0'); }

async function ensureDir(d){ await fs.promises.mkdir(d, { recursive: true }); }

async function duplicateUntil(dir, targetCount, prefix){
  await ensureDir(dir);
  const files = (await fs.promises.readdir(dir)).filter(f=>fs.statSync(path.join(dir,f)).isFile());
  if(files.length >= targetCount) return (await fs.promises.readdir(dir)).filter(f=>fs.statSync(path.join(dir,f)).isFile());
  let idx = 1;
  while (files.length < targetCount) {
    for (const f of files.slice(0)) {
      if (files.length >= targetCount) break;
      const ext = path.extname(f);
      const base = path.basename(f, ext);
      const newName = `${base}-${prefix}${pad(idx)}${ext}`;
      const src = path.join(dir, f);
      const dst = path.join(dir, newName);
      await fs.promises.copyFile(src, dst);
      files.push(newName);
      idx++;
    }
    // safety to avoid infinite loop
    if (idx > 100000) break;
  }
  return files;
}

async function updateCsv(mainFiles, galleryFiles){
  if(!fs.existsSync(namesOnlyCsv)){
    console.error('Names-only CSV not found:', namesOnlyCsv);
    process.exitCode = 1;
    return;
  }
  const rows = (await fs.promises.readFile(namesOnlyCsv, 'utf8')).split(/\r?\n/);
  const header = rows.shift();
  const cols = header.split(',');
  const mainIdx = cols.indexOf('mainImage');
  const galleryIdx = cols.indexOf('galleryImages');
  if(mainIdx === -1 || galleryIdx === -1){
    console.error('CSV missing mainImage or galleryImages columns');
    process.exitCode = 1;
    return;
  }
  const out = [header];
  let mIdx=0, gIdx=0;
  for(const line of rows){
    if(!line.trim()){ out.push(line); continue; }
    // naive CSV split, but preserves existing structure
    const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    // assign main image
    parts[mainIdx] = mainFiles[mIdx % mainFiles.length];
    mIdx++;
    // assign 3 gallery images per product sequentially
    const g1 = galleryFiles[gIdx % galleryFiles.length]; gIdx++;
    const g2 = galleryFiles[gIdx % galleryFiles.length]; gIdx++;
    const g3 = galleryFiles[gIdx % galleryFiles.length]; gIdx++;
    parts[galleryIdx] = `[${g1},${g2},${g3}]`;
    out.push(parts.join(','));
  }
  const outPath = path.join(ROOT, 'src', 'data', 'products.names-only.images-expanded.csv');
  await fs.promises.writeFile(outPath, out.join('\n'));
  console.log('Wrote expanded CSV:', outPath);
}

async function main(){
  await ensureDir(mainDir);
  await ensureDir(galleryDir);
  await ensureDir(reportsDir);
  console.log('Counting existing files...');
  const mainFiles = (await fs.promises.readdir(mainDir)).filter(f=>fs.statSync(path.join(mainDir,f)).isFile());
  const galleryFiles = (await fs.promises.readdir(galleryDir)).filter(f=>fs.statSync(path.join(galleryDir,f)).isFile());
  console.log('Existing main:', mainFiles.length, 'gallery:', galleryFiles.length);

  const targetMain = 1176;
  const targetGallery = 3000;

  const newMain = await duplicateUntil(mainDir, targetMain, 'dup');
  const newGallery = await duplicateUntil(galleryDir, targetGallery, 'dup');

  console.log('After duplication - main:', newMain.length, 'gallery:', newGallery.length);

  // write small report
  const report = { before: { main: mainFiles.length, gallery: galleryFiles.length }, after: { main: newMain.length, gallery: newGallery.length }, generatedAt: new Date().toISOString() };
  await fs.promises.writeFile(path.join(reportsDir, 'images-expansion-report.json'), JSON.stringify(report, null, 2));

  // update CSV references
  await updateCsv(newMain, newGallery);

  console.log('Done.');
}

main().catch(err=>{ console.error(err); process.exitCode=1; });
