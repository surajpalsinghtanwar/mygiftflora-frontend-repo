$mainCount = (Get-ChildItem -Path src/data/product_images/main -File | Where-Object { $_.Extension -ieq '.png' }).Count
$galCount = (Get-ChildItem -Path src/data/product_images/gallery -File | Where-Object { $_.Extension -ieq '.png' }).Count
Write-Host "Main PNGs: $mainCount, Gallery PNGs: $galCount"

# show sample CSV lines that contain 'mainImage' and show first 5 lines with that column
$csv = Import-Csv -Path src/data/products.csv
$sample = $csv | Select-Object name,slug,mainImage,galleryImages -First 6
$sample | Format-Table -AutoSize
