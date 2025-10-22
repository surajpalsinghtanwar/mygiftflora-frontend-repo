const fs = require('fs');
const csv = require('csvtojson');
const xlsx = require('xlsx');

const csvFilePath = 'src/data/subcategories.csv';
const xlsxFilePath = 'src/data/subcategories.xlsx';

csv()
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    const worksheet = xlsx.utils.json_to_sheet(jsonArray);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Subcategories');
    xlsx.writeFile(workbook, xlsxFilePath);
    console.log('Conversion complete:', xlsxFilePath);
  });
