const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

try {
  console.log('Starting Excel conversion...');
  
  const csvFilePath = path.join(__dirname, 'src', 'data', 'categories.csv');
  console.log('Reading CSV from:', csvFilePath);
  
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  console.log('CSV data loaded successfully');
  
  const workbook = XLSX.read(csvData, { type: 'string' });
  console.log('Workbook created');
  
  const excelFilePath = path.join(__dirname, 'src', 'data', 'categories.xlsx');
  XLSX.writeFile(workbook, excelFilePath);
  
  console.log(' Categories Excel file created successfully!');
  console.log(' File location:', excelFilePath);
  
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  console.log(' Total categories:', jsonData.length);
  
  console.log('  Image specifications: All images should be 400x300px');
  console.log(' Images folder: src/data/category/');
  
} catch (error) {
  console.error(' Error creating Excel file:', error.message);
}
