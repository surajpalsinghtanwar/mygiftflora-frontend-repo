$samples = @( 
  'src/data/product_images/main/type-1.png',
  'src/data/product_images/gallery/type-1-g1.png',
  'src/data/product_images/main/brand-1.png'
)
Add-Type -AssemblyName System.Drawing
foreach ($p in $samples) {
  if (-not (Test-Path $p)) { Write-Host "MISSING: $p"; continue }
  try {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $p).Path)
    Write-Host "Loaded: $p -> ${($img.Width)}x${($img.Height)} bytes:$((Get-Item $p).Length)"
    $img.Dispose()
  } catch {
    Write-Host "ERROR loading $p -> $($_.Exception.Message)"
  }
}
