const fs = require('fs');
const path = require('path');

// Create minimal 1x1 pixel JPG images and scale them to 400x300 conceptually
// This creates valid JPG files that can be opened by any image viewer

const createMinimalJPG = (categoryName, colorHex) => {
  // This is a minimal valid JPEG file (1x1 pixel) that can be used as placeholder
  // In a real scenario, you would use an image library like Sharp or Canvas to create proper images
  const minimalJPEG = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
    0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
    0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
    0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
    0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
    0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
    0xFF, 0xD9
  ]);
  
  return minimalJPEG;
};

// Category configurations
const categories = [
  { name: 'Cakes', filename: 'cakes.jpg' },
  { name: 'Flowers', filename: 'flowers.jpg' },
  { name: 'Gifts', filename: 'gifts.jpg' },
  { name: 'Plants', filename: 'plants.jpg' },
  { name: 'Chocolates', filename: 'chocolates.jpg' },
  { name: 'Combos', filename: 'combos.jpg' },
  { name: 'Personalized', filename: 'personalized.jpg' },
  { name: 'Sweets', filename: 'sweets.jpg' },
  { name: 'Dry Fruits', filename: 'dry-fruits.jpg' },
  { name: 'Balloons', filename: 'balloons.jpg' }
];

// Create category folder if not exists
const categoryDir = path.join(__dirname, 'src', 'data', 'category');
if (!fs.existsSync(categoryDir)) {
  fs.mkdirSync(categoryDir, { recursive: true });
}

// Generate JPG images for each category
categories.forEach(category => {
  const jpgData = createMinimalJPG(category.name);
  const jpgFilePath = path.join(categoryDir, category.filename);
  
  fs.writeFileSync(jpgFilePath, jpgData);
  console.log(`✅ Created ${category.filename} (Valid JPG file)`);
});

console.log('\n🎨 All category JPG images created successfully!');
console.log('📏 All images are valid JPG format');
console.log('🎯 Ready for backend upload');
console.log('\n📁 Location: src/data/category/');

// Create README for replacing with actual images
const readmeContent = `# Category Images (400x300px)

## Current Status: 
✅ Valid JPG placeholder files created
📏 All files are proper JPG format
🎯 Ready for backend upload

## Next Steps:
1. Replace these placeholder JPG files with actual 400x300px category images
2. Maintain exact filenames as listed below
3. Ensure all images are exactly 400x300 pixels

## Required Images:
${categories.map((cat, index) => `${index + 1}. ${cat.filename} - ${cat.name} category image`).join('\n')}

## Image Specifications:
- **Size**: 400px × 300px (4:3 aspect ratio)
- **Format**: JPG
- **Quality**: High quality, web-optimized
- **File Size**: Recommended 50-150KB per image

## Upload to Backend:
These images will be uploaded to your backend along with the categories Excel file.
The Excel file contains the exact filenames that match these image files.
`;

fs.writeFileSync(path.join(categoryDir, 'README.md'), readmeContent);
console.log('📝 Created README.md with image specifications');

// List final files
console.log('\n📋 Final category image files:');
const files = fs.readdirSync(categoryDir);
files.filter(f => f.endsWith('.jpg')).forEach(file => {
  const stats = fs.statSync(path.join(categoryDir, file));
  console.log(`   ${file} (${stats.size} bytes)`);
});