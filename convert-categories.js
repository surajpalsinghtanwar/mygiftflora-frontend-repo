const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to convert CSV to Excel
function csvToExcel(csvPath, excelPath) {
    try {
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const worksheet = XLSX.utils.aoa_to_sheet(
            csvData.split('\n').map(row => row.split(','))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
        XLSX.writeFile(workbook, excelPath);
        console.log(`✅ Converted categories.csv to categories.xlsx`);
    } catch (error) {
        console.error(`❌ Error converting categories.csv:`, error.message);
    }
}

// Convert categories file
const dataDir = path.join(__dirname, 'src', 'data');
csvToExcel(
    path.join(dataDir, 'categories.csv'),
    path.join(dataDir, 'categories-new.xlsx')
);