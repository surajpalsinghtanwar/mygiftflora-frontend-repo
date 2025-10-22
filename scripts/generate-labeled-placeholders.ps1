Add-Type -AssemblyName System.Drawing

$csvPath = "src/data/products.csv"
if (-Not (Test-Path $csvPath)) { Write-Error "Missing $csvPath"; exit 1 }

$rows = Import-Csv -Path $csvPath

function New-LabeledImage {
  param(
    [string]$filePath,
    [string]$label
  )
  $dir = Split-Path $filePath -Parent
  if (-Not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  # Create bitmap 800x600
  $width = 800
  $height = 600
  $bmp = New-Object System.Drawing.Bitmap $width, $height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.Clear([System.Drawing.Color]::FromArgb(255, 245, 245, 245))
    $font = New-Object System.Drawing.Font('Segoe UI',36,[System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60,60,60))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $rect = New-Object System.Drawing.RectangleF 0,0,$width,$height
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $g.DrawString($label, $font, $brush, $rect, $sf)

    # Draw a subtle border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200,200,200),4)
    $g.DrawRectangle($pen, 2,2, $width-5, $height-5)
  }
  finally {
    $g.Dispose()
  }

  # Save as PNG bytes (even if filename ends with .jpg we preserve name so CSV matches)
  try {
    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $bmp.Dispose()
  }
}

$created = 0
$pathsSeen = @{}

foreach ($r in $rows) {
  # main image
  $main = $r.mainImage
  if ($main) {
    $m = $main.Trim('"')
    if (-not [string]::IsNullOrWhiteSpace($m)) {
      $path = Join-Path 'src/data/product_images/main' $m
      if (-not $pathsSeen.ContainsKey($path)) {
        New-LabeledImage -filePath $path -label $m
        $pathsSeen[$path] = $true
        $created++
      }
    }
  }

  # gallery images column may be like [a.jpg,b.jpg]
  $gcol = $r.galleryImages
  if ($gcol) {
    $raw = $gcol -replace '^\[|\]$','' -replace '"',''
    $items = $raw -split ',' | ForEach-Object { $_.Trim() } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    foreach ($it in $items) {
      $path = Join-Path 'src/data/product_images/gallery' $it
      if (-not $pathsSeen.ContainsKey($path)) {
        New-LabeledImage -filePath $path -label $it
        $pathsSeen[$path] = $true
        $created++
      }
    }
  }
}

Write-Host "Created or updated $created placeholder images (preserved original filenames)."
