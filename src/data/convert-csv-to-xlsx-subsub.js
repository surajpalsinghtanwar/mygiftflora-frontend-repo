const csvtojson = require('csvtojson');
const XLSX = require('xlsx');
const fs = require('fs');

const csvFilePath = 'src/data/subsubcategories.csv';
const xlsxFilePath = 'src/data/subsubcategories.xlsx';

csvtojson()
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subsubcategories');
    XLSX.writeFile(workbook, xlsxFilePath);
    console.log('Conversion complete:', xlsxFilePath);
  })
  .catch((err) => {
    console.error('Error converting CSV to XLSX:', err);
  });
