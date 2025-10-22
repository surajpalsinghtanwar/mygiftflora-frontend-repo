const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to convert CSV to Excel
function csvToExcel(csvFilePath, excelFilePath) {
  try {
    // Read CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse CSV to workbook
    const workbook = XLSX.read(csvData, { type: 'string' });
    
    // Write to Excel file
    XLSX.writeFile(workbook, excelFilePath);
    
    console.log(`✅ Converted ${path.basename(csvFilePath)} to ${path.basename(excelFilePath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${csvFilePath}:`, error.message);
  }
}

// Define file paths
const dataDir = path.join(__dirname, 'src', 'data');
const files = [
  { csv: 'categories.csv', excel: 'categories.xlsx' },
  { csv: 'subcategories.csv', excel: 'subcategories.xlsx' },
  { csv: 'subsubcategories.csv', excel: 'subsubcategories.xlsx' },
  { csv: 'products.csv', excel: 'products.xlsx' }
];

console.log('🚀 Converting CSV files to Excel format...\n');

// Convert each file
files.forEach(file => {
  const csvPath = path.join(dataDir, file.csv);
  const excelPath = path.join(dataDir, file.excel);
  
  if (fs.existsSync(csvPath)) {
    csvToExcel(csvPath, excelPath);
  } else {
    console.log(`⚠️  CSV file not found: ${file.csv}`);
  }
});

console.log('\n✨ Conversion completed! Check the data folder for Excel files.');
console.log('\n📋 File descriptions:');
console.log('• categories.xlsx - Main product categories (Cakes, Flowers, Gifts, etc.)');
console.log('• subcategories.xlsx - Sub-categories (By Type, By Occasion, etc.)');
console.log('• subsubcategories.xlsx - Detailed sub-categories (Birthday Cakes, Red Roses, etc.)');
console.log('• products.xlsx - Sample products with all required fields');

console.log('\n🔗 Relationships:');
console.log('• Subcategories link to Categories via category_id');
console.log('• Subsubcategories link to Categories and Subcategories via category_id and subcategory_id');
console.log('• Products link to all three via category_id, subcategory_id, and subsubcategory_id');

console.log('\n📤 Upload Instructions:');
console.log('1. Use the Excel files for bulk upload in your admin panel');
console.log('2. Maintain the ID relationships when adding new data');
console.log('3. Ensure all required fields are filled');
console.log('4. Test with a few records before bulk upload');