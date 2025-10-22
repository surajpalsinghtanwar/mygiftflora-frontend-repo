$backupDir = "src/data/product_images_backup_$(Get-Date -Format yyyyMMddHHmmss)"
New-Item -ItemType Directory -Path $backupDir | Out-Null

$folders = @("src/data/product_images/main", "src/data/product_images/gallery")

# 1x1 transparent PNG
$pngBytes = [System.Convert]::FromBase64String(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
)

foreach ($f in $folders) {
  if (-Not (Test-Path $f)) { Write-Host "Missing folder: $f"; continue }
  $files = Get-ChildItem -File -Path $f
  foreach ($file in $files) {
    $src = $file.FullName
    $destBackup = Join-Path $backupDir $file.Name
    # backup
    Copy-Item -Path $src -Destination $destBackup -Force
    # overwrite with valid PNG bytes
    [System.IO.File]::WriteAllBytes($src, $pngBytes)
  }
}

Write-Host "Backed up originals to: $backupDir and replaced with 1x1 PNGs"
