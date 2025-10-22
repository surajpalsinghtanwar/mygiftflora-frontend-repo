$main = Get-ChildItem -Path src/data/product_images/main -File | Measure-Object
$gal = Get-ChildItem -Path src/data/product_images/gallery -File | Measure-Object
Write-Host "Main images:$($main.Count) Gallery images:$($gal.Count)"
Get-ChildItem -Path src/data/product_images/main -File | Select-Object -First 5 | Format-Table Name,Length -AutoSize
