const XLSX = require('xlsx');
const path = require('path');

// Function to read Excel file and return data
function readExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Validation functions
function validateCategories(categories) {
  console.log('\n📋 Validating Categories...');
  const errors = [];
  const ids = new Set();
  
  categories.forEach((cat, index) => {
    const row = index + 2; // Excel row number (header is row 1)
    
    // Check required fields
    if (!cat.id) errors.push(`Row ${row}: Missing ID`);
    if (!cat.name) errors.push(`Row ${row}: Missing name`);
    if (!cat.slug) errors.push(`Row ${row}: Missing slug`);
    
    // Check for duplicate IDs
    if (cat.id && ids.has(cat.id)) {
      errors.push(`Row ${row}: Duplicate ID ${cat.id}`);
    }
    ids.add(cat.id);
    
    // Check status format
    if (cat.status && !['TRUE', 'FALSE', true, false].includes(cat.status)) {
      errors.push(`Row ${row}: Invalid status format (use TRUE/FALSE)`);
    }
  });
  
  if (errors.length === 0) {
    console.log(`✅ Categories validation passed (${categories.length} records)`);
  } else {
    console.log(`❌ Categories validation failed:`);
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  return { valid: errors.length === 0, errors };
}

function validateSubcategories(subcategories, categories) {
  console.log('\n📋 Validating Subcategories...');
  const errors = [];
  const ids = new Set();
  const categoryIds = new Set(categories.map(c => c.id));
  
  subcategories.forEach((subcat, index) => {
    const row = index + 2;
    
    // Check required fields
    if (!subcat.id) errors.push(`Row ${row}: Missing ID`);
    if (!subcat.name) errors.push(`Row ${row}: Missing name`);
    if (!subcat.category_id) errors.push(`Row ${row}: Missing category_id`);
    
    // Check for duplicate IDs
    if (subcat.id && ids.has(subcat.id)) {
      errors.push(`Row ${row}: Duplicate ID ${subcat.id}`);
    }
    ids.add(subcat.id);
    
    // Check foreign key reference
    if (subcat.category_id && !categoryIds.has(subcat.category_id)) {
      errors.push(`Row ${row}: Invalid category_id ${subcat.category_id}`);
    }
    
    // Check status format
    if (subcat.status && !['TRUE', 'FALSE', true, false].includes(subcat.status)) {
      errors.push(`Row ${row}: Invalid status format (use TRUE/FALSE)`);
    }
  });
  
  if (errors.length === 0) {
    console.log(`✅ Subcategories validation passed (${subcategories.length} records)`);
  } else {
    console.log(`❌ Subcategories validation failed:`);
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  return { valid: errors.length === 0, errors };
}

function validateSubsubcategories(subsubcategories, categories, subcategories) {
  console.log('\n📋 Validating Subsubcategories...');
  const errors = [];
  const ids = new Set();
  const categoryIds = new Set(categories.map(c => c.id));
  const subcategoryIds = new Set(subcategories.map(s => s.id));
  
  subsubcategories.forEach((subsubcat, index) => {
    const row = index + 2;
    
    // Check required fields
    if (!subsubcat.id) errors.push(`Row ${row}: Missing ID`);
    if (!subsubcat.name) errors.push(`Row ${row}: Missing name`);
    if (!subsubcat.category_id) errors.push(`Row ${row}: Missing category_id`);
    if (!subsubcat.subcategory_id) errors.push(`Row ${row}: Missing subcategory_id`);
    
    // Check for duplicate IDs
    if (subsubcat.id && ids.has(subsubcat.id)) {
      errors.push(`Row ${row}: Duplicate ID ${subsubcat.id}`);
    }
    ids.add(subsubcat.id);
    
    // Check foreign key references
    if (subsubcat.category_id && !categoryIds.has(subsubcat.category_id)) {
      errors.push(`Row ${row}: Invalid category_id ${subsubcat.category_id}`);
    }
    if (subsubcat.subcategory_id && !subcategoryIds.has(subsubcat.subcategory_id)) {
      errors.push(`Row ${row}: Invalid subcategory_id ${subsubcat.subcategory_id}`);
    }
    
    // Check status format
    if (subsubcat.status && !['TRUE', 'FALSE', true, false].includes(subsubcat.status)) {
      errors.push(`Row ${row}: Invalid status format (use TRUE/FALSE)`);
    }
  });
  
  if (errors.length === 0) {
    console.log(`✅ Subsubcategories validation passed (${subsubcategories.length} records)`);
  } else {
    console.log(`❌ Subsubcategories validation failed:`);
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  return { valid: errors.length === 0, errors };
}

function validateProducts(products, categories, subcategories, subsubcategories) {
  console.log('\n📋 Validating Products...');
  const errors = [];
  const ids = new Set();
  const categoryIds = new Set(categories.map(c => c.id));
  const subcategoryIds = new Set(subcategories.map(s => s.id));
  const subsubcategoryIds = new Set(subsubcategories.map(s => s.id));
  
  products.forEach((product, index) => {
    const row = index + 2;
    
    // Check required fields
    if (!product.id) errors.push(`Row ${row}: Missing ID`);
    if (!product.name) errors.push(`Row ${row}: Missing name`);
    if (!product.price) errors.push(`Row ${row}: Missing price`);
    if (!product.category_id) errors.push(`Row ${row}: Missing category_id`);
    
    // Check for duplicate IDs
    if (product.id && ids.has(product.id)) {
      errors.push(`Row ${row}: Duplicate ID ${product.id}`);
    }
    ids.add(product.id);
    
    // Check foreign key references
    if (product.category_id && !categoryIds.has(product.category_id)) {
      errors.push(`Row ${row}: Invalid category_id ${product.category_id}`);
    }
    if (product.subcategory_id && !subcategoryIds.has(product.subcategory_id)) {
      errors.push(`Row ${row}: Invalid subcategory_id ${product.subcategory_id}`);
    }
    if (product.subsubcategory_id && !subsubcategoryIds.has(product.subsubcategory_id)) {
      errors.push(`Row ${row}: Invalid subsubcategory_id ${product.subsubcategory_id}`);
    }
    
    // Check price format
    if (product.price && isNaN(product.price)) {
      errors.push(`Row ${row}: Invalid price format (should be number)`);
    }
    if (product.original_price && isNaN(product.original_price)) {
      errors.push(`Row ${row}: Invalid original_price format (should be number)`);
    }
    
    // Check status format
    if (product.status && !['TRUE', 'FALSE', true, false].includes(product.status)) {
      errors.push(`Row ${row}: Invalid status format (use TRUE/FALSE)`);
    }
    
    // Check in_stock format
    if (product.in_stock && !['TRUE', 'FALSE', true, false].includes(product.in_stock)) {
      errors.push(`Row ${row}: Invalid in_stock format (use TRUE/FALSE)`);
    }
  });
  
  if (errors.length === 0) {
    console.log(`✅ Products validation passed (${products.length} records)`);
  } else {
    console.log(`❌ Products validation failed:`);
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  return { valid: errors.length === 0, errors };
}

// Main validation function
function validateAllData() {
  console.log('🔍 Starting data validation...');
  
  const dataDir = path.join(__dirname, 'src', 'data');
  
  // Read all Excel files
  const categories = readExcelFile(path.join(dataDir, 'categories.xlsx'));
  const subcategories = readExcelFile(path.join(dataDir, 'subcategories.xlsx'));
  const subsubcategories = readExcelFile(path.join(dataDir, 'subsubcategories.xlsx'));
  const products = readExcelFile(path.join(dataDir, 'products.xlsx'));
  
  if (categories.length === 0) {
    console.log('❌ No category data found. Please ensure categories.xlsx exists and contains data.');
    return;
  }
  
  // Validate each dataset
  const categoryValidation = validateCategories(categories);
  const subcategoryValidation = validateSubcategories(subcategories, categories);
  const subsubcategoryValidation = validateSubsubcategories(subsubcategories, categories, subcategories);
  const productValidation = validateProducts(products, categories, subcategories, subsubcategories);
  
  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`Categories: ${categoryValidation.valid ? '✅ Valid' : '❌ Invalid'} (${categories.length} records)`);
  console.log(`Subcategories: ${subcategoryValidation.valid ? '✅ Valid' : '❌ Invalid'} (${subcategories.length} records)`);
  console.log(`Subsubcategories: ${subsubcategoryValidation.valid ? '✅ Valid' : '❌ Invalid'} (${subsubcategories.length} records)`);
  console.log(`Products: ${productValidation.valid ? '✅ Valid' : '❌ Invalid'} (${products.length} records)`);
  
  const allValid = categoryValidation.valid && subcategoryValidation.valid && 
                   subsubcategoryValidation.valid && productValidation.valid;
  
  console.log(`\n🎯 Overall Status: ${allValid ? '✅ All data is valid and ready for upload!' : '❌ Please fix the errors above before uploading.'}`);
  
  if (allValid) {
    console.log('\n📤 Next Steps:');
    console.log('1. Upload categories.xlsx first');
    console.log('2. Then upload subcategories.xlsx');
    console.log('3. Then upload subsubcategories.xlsx');
    console.log('4. Finally upload products.xlsx');
  }
}

// Run validation
validateAllData();