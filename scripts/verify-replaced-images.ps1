$paths = @( 'src/data/product_images/main/type-1.jpg','src/data/product_images/gallery/type-1-g1.jpg','src/data/product_images/main/brand-1.jpg' )
foreach ($p in $paths) {
  if (-Not (Test-Path $p)) { Write-Host "MISSING: $p"; continue }
  $b = [System.IO.File]::ReadAllBytes($p)
  $len = $b.Length
  $arr = $b[0..([Math]::Min(15,$len-1))] | ForEach-Object { $_.ToString('X2') }
  $hex = [string]::Join(' ', $arr)
  Write-Host "File: $p Size: $len Header: $hex"
}
