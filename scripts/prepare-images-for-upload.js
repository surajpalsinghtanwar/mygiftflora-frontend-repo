const fs = require('fs');
const path = require('path');

function slugify(name) {
  return name
    .replace(/\..+$/, '') // remove extension for slugging
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9\s-]/g, ' ') // replace non-alnum with space
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

async function prepareFolder(srcFolder, destFolder, manifest) {
  await fs.promises.mkdir(destFolder, { recursive: true });
  const entries = await fs.promises.readdir(srcFolder, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    const originalName = e.name;
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    const slug = slugify(originalName);
    let newName = `${slug}${ext.toLowerCase()}`;
    // avoid collisions by appending a counter if needed
    let counter = 1;
    while (manifest.find(m => m.newName === newName)) {
      newName = `${slug}-${counter}${ext.toLowerCase()}`;
      counter++;
    }
    const srcPath = path.join(srcFolder, originalName);
    const destPath = path.join(destFolder, newName);
    await fs.promises.copyFile(srcPath, destPath);
    manifest.push({ originalName, newName });
  }
}

async function main() {
  const root = path.join(__dirname, '..', 'src', 'data', 'product_images');
  const mainSrc = path.join(root, 'main');
  const gallerySrc = path.join(root, 'gallery');
  const outRoot = path.join(root, 'upload_ready');
  const mainOut = path.join(outRoot, 'main');
  const galleryOut = path.join(outRoot, 'gallery');

  const manifest = { main: [], gallery: [], generatedAt: new Date().toISOString() };
  try {
    await prepareFolder(mainSrc, mainOut, manifest.main);
    await prepareFolder(gallerySrc, galleryOut, manifest.gallery);

    // write manifest files
    const reportsDir = path.join(__dirname, '..', 'src', 'data', 'reports');
    await fs.promises.mkdir(reportsDir, { recursive: true });
    const jsonPath = path.join(reportsDir, 'images-upload-manifest.json');
    const csvPath = path.join(reportsDir, 'images-upload-manifest.csv');
    await fs.promises.writeFile(jsonPath, JSON.stringify(manifest, null, 2));

    const csvLines = ["type,originalName,newName"];
    for (const m of manifest.main) csvLines.push(`main,${m.originalName},${m.newName}`);
    for (const m of manifest.gallery) csvLines.push(`gallery,${m.originalName},${m.newName}`);
    await fs.promises.writeFile(csvPath, csvLines.join('\n'));

    console.log('Prepared upload-ready images.');
    console.log('Main count:', manifest.main.length);
    console.log('Gallery count:', manifest.gallery.length);
    console.log('Manifest JSON:', jsonPath);
    console.log('Manifest CSV:', csvPath);
    console.log('Upload-ready folders under:', outRoot);
  } catch (err) {
    console.error('Error preparing images:', err);
    process.exitCode = 1;
  }
}

main();
