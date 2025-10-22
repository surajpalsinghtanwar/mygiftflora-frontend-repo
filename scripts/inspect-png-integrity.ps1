$folders = @('src/data/product_images/main','src/data/product_images/gallery')
$pngHeader = @(0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A)
$pngIEND = @(0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82)

foreach ($fpath in $folders) {
  Write-Host "\nChecking folder: $fpath"
  if (-Not (Test-Path $fpath)) { Write-Host "Missing folder: $fpath"; continue }
  $files = Get-ChildItem -Path $fpath -File | Select-Object -First 40
  foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $len = $bytes.Length
    $start = $bytes[0..([Math]::Min($pngHeader.Count-1,$len-1))]
    $endIdxStart = [Math]::Max(0,$len - $pngIEND.Count)
    $end = $bytes[$endIdxStart..($len-1)]
    $startOK = ($start.Length -eq $pngHeader.Length) -and (-not ($start -ceq $pngHeader | Where-Object { -not $_ }))
    $endOK = ($end.Length -eq $pngIEND.Length) -and (-not ($end -ceq $pngIEND | Where-Object { -not $_ }))
    if (-not $startOK -or -not $endOK) {
      Write-Host "INVALID: $($file.Name) Size:$len StartOK:$startOK EndOK:$endOK"
    } else {
      Write-Host "OK: $($file.Name) Size:$len"
    }
  }
}
