param()

$csvPath = 'src/data/products.csv'
if (-Not (Test-Path $csvPath)) { Write-Error "Missing $csvPath"; exit 1 }

Write-Host "Reading CSV: $csvPath"
$rows = Import-Csv -Path $csvPath

$missing = @()

foreach ($r in $rows) {
  $main = $r.mainImage
  if ($main -and -not [string]::IsNullOrWhiteSpace($main)) {
    $main = $main.Trim('"')
    $p = Join-Path 'src/data/product_images/main' $main
    if (-not (Test-Path $p)) { $missing += $p }
  }
  $gcol = $r.galleryImages
  if ($gcol -and -not [string]::IsNullOrWhiteSpace($gcol)) {
    $raw = $gcol -replace '^\[|\]$','' -replace '"',''
    $items = $raw -split ',' | ForEach-Object { $_.Trim() } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    foreach ($it in $items) {
      $p = Join-Path 'src/data/product_images/gallery' $it
      if (-not (Test-Path $p)) { $missing += $p }
    }
  }
}

$missing = $missing | Sort-Object -Unique
Write-Host "Missing files detected: $($missing.Count)"
if ($missing.Count -gt 0) {
  $listFile = "src/data/missing_images_$(Get-Date -Format yyyyMMddHHmmss).txt"
  $missing | Out-File -FilePath $listFile -Encoding UTF8
  Write-Host "Wrote missing file list to: $listFile"
  Write-Host "Running generate-labeled-placeholders.ps1 to create placeholders for referenced filenames..."
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\generate-labeled-placeholders.ps1

  # Re-check after generation
  $missing2 = @()
  foreach ($m in $missing) { if (-not (Test-Path $m)) { $missing2 += $m } }
  Write-Host "Missing after generation: $($missing2.Count)"
  if ($missing2.Count -gt 0) {
    Write-Host "Some files are still missing. See: $listFile and re-run if needed."; exit 2
  }
} else {
  Write-Host "All referenced files already exist. No action required."
}

Write-Host "Check complete."
