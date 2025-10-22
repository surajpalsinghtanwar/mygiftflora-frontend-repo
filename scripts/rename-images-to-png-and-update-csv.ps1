$imageFolders = @("src/data/product_images/main", "src/data/product_images/gallery")
$timestamp = Get-Date -Format yyyyMMddHHmmss
$imgBackupDir = "src/data/product_images_backup_$timestamp"
New-Item -ItemType Directory -Path $imgBackupDir | Out-Null

# Backup CSV
$csvPath = "src/data/products.csv"
if (-Not (Test-Path $csvPath)) { Write-Error "Missing $csvPath"; exit 1 }
$csvBak = "src/data/products.csv.bak.$timestamp"
Copy-Item -Path $csvPath -Destination $csvBak -Force

$renameMap = @{}

foreach ($folder in $imageFolders) {
  if (-Not (Test-Path $folder)) { continue }
  $files = Get-ChildItem -Path $folder -File
  foreach ($f in $files) {
    $ext = [System.IO.Path]::GetExtension($f.Name).ToLower()
    if ($ext -in '.jpg','.jpeg') {
      $oldFull = $f.FullName
      $newName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name) + '.png'
      $newFull = Join-Path $folder $newName
      # backup original file
      Copy-Item -Path $oldFull -Destination (Join-Path $imgBackupDir $f.Name) -Force
      # if target exists, skip
      if (Test-Path $newFull) {
        # remove original to avoid duplicates
        Remove-Item -Path $oldFull -Force
      } else {
        Rename-Item -Path $oldFull -NewName $newName
      }
      $renameMap[$f.Name] = $newName
    }
  }
}

if ($renameMap.Count -eq 0) { Write-Host "No .jpg/.jpeg files found to rename."; exit 0 }

# Update CSV contents
$csvText = Get-Content -Path $csvPath -Raw
foreach ($k in $renameMap.Keys) {
  $v = $renameMap[$k]
  # replace occurrences of the filename (simple replace)
  $csvText = $csvText -replace [Regex]::Escape($k), $v
}

# Write updated CSV (backup already made)
Set-Content -Path $csvPath -Value $csvText -Force

Write-Host "Renamed $($renameMap.Count) files and updated CSV. Backups: $imgBackupDir , $csvBak"
