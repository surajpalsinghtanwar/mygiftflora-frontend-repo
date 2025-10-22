
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function convertCsvToXlsx(csvFile, xlsxFile, sheetName) {
	const csvData = fs.readFileSync(csvFile, 'utf8');
	const rows = csvData.split(/\r?\n/).map(row => row.split(','));
	const worksheet = XLSX.utils.aoa_to_sheet(rows);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
	XLSX.writeFile(workbook, xlsxFile);
	console.log(`Conversion complete: ${xlsxFile}`);
}

const dataDir = path.join(__dirname, 'src', 'data');
const files = [
	{
		csv: path.join(dataDir, 'subcategories_template.csv'),
		xlsx: path.join(dataDir, 'subcategories_template.xlsx'),
		sheet: 'Subcategories'
	},
	{
		csv: path.join(dataDir, 'subsubcategories_template.csv'),
		xlsx: path.join(dataDir, 'subsubcategories_template.xlsx'),
		sheet: 'Subsubcategories'
	}
];

files.forEach(file => {
	if (fs.existsSync(file.csv)) {
		convertCsvToXlsx(file.csv, file.xlsx, file.sheet);
	} else {
		console.log(`CSV file not found: ${file.csv}`);
	}
});
