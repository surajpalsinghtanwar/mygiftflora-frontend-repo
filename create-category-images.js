const fs = require('fs');
const path = require('path');

// Create a simple colored rectangle image using Canvas (if available) or create SVG placeholders
const createCategoryImage = (categoryName, color, width = 400, height = 300) => {
  // Create SVG content
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="10"/>
  <text x="50%" y="40%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="28" font-weight="bold">${categoryName.toUpperCase()}</text>
  <text x="50%" y="60%" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="16">Category Image</text>
  <text x="50%" y="75%" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Arial, sans-serif" font-size="14">${width}x${height}px</text>
</svg>`;
  return svgContent;
};

// Category configurations with colors
const categories = [
  { name: 'Cakes', color: '#FF6B6B', filename: 'cakes.jpg' },
  { name: 'Flowers', color: '#4ECDC4', filename: 'flowers.jpg' },
  { name: 'Gifts', color: '#45B7D1', filename: 'gifts.jpg' },
  { name: 'Plants', color: '#96CEB4', filename: 'plants.jpg' },
  { name: 'Chocolates', color: '#FECA57', filename: 'chocolates.jpg' },
  { name: 'Combos', color: '#FF9FF3', filename: 'combos.jpg' },
  { name: 'Personalized', color: '#54A0FF', filename: 'personalized.jpg' },
  { name: 'Sweets', color: '#5F27CD', filename: 'sweets.jpg' },
  { name: 'Dry Fruits', color: '#00D2D3', filename: 'dry-fruits.jpg' },
  { name: 'Balloons', color: '#FF9F43', filename: 'balloons.jpg' }
];

// Create category folder if not exists
const categoryDir = path.join(__dirname, 'src', 'data', 'category');
if (!fs.existsSync(categoryDir)) {
  fs.mkdirSync(categoryDir, { recursive: true });
}

// Generate SVG images for each category
categories.forEach(category => {
  const svgContent = createCategoryImage(category.name, category.color);
  const svgFilePath = path.join(categoryDir, category.filename.replace('.jpg', '.svg'));
  
  fs.writeFileSync(svgFilePath, svgContent);
  console.log(`✅ Created ${category.filename.replace('.jpg', '.svg')} (400x300px)`);
});

console.log('\n🎨 All category images created successfully!');
console.log('📏 All images are 400x300px in size');
console.log('🎯 Images saved as SVG format for web compatibility');
console.log('\n📁 Location: src/data/category/');
console.log('\n💡 Note: SVG images will scale perfectly and have consistent dimensions');

// Also create a simple HTML file to preview all images
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Category Images Preview</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .category-card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .category-image { width: 100%; height: auto; border-radius: 4px; }
        .category-name { text-align: center; margin-top: 10px; font-weight: bold; color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Category Images Preview (400x300px)</h1>
        <div class="grid">
            ${categories.map(cat => `
                <div class="category-card">
                    <img src="${cat.filename.replace('.jpg', '.svg')}" alt="${cat.name}" class="category-image">
                    <div class="category-name">${cat.name}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(categoryDir, 'preview.html'), htmlContent);
console.log('🔍 Created preview.html to view all category images');