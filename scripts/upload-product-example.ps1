param(
  [string]$ApiBase = 'http://localhost:8000',
  [string]$Token = ''
)

# Example: powershell -File scripts\upload-product-example.ps1 -ApiBase 'http://localhost:8000' -Token 'Bearer ...'

$url = "$ApiBase/api/admin/product"

Write-Host "Posting to: $url"

# Build multipart form using System.Net.Http.MultipartFormDataContent
Add-Type -AssemblyName System.Net.Http

$client = New-Object System.Net.Http.HttpClient
if ($Token -ne '') { $client.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::Parse($Token) }

$multipart = New-Object System.Net.Http.MultipartFormDataContent

# Simple text fields
$multipart.Add((New-Object System.Net.Http.StringContent('prod')), 'name')
$multipart.Add((New-Object System.Net.Http.StringContent('<p>dfsfdfsdff afsdfsdf</p>')), 'description')
$multipart.Add((New-Object System.Net.Http.StringContent('tesfkkk')), 'sku')
$multipart.Add((New-Object System.Net.Http.StringContent('12')), 'stock')
$multipart.Add((New-Object System.Net.Http.StringContent('50')), 'price')
$multipart.Add((New-Object System.Net.Http.StringContent('50')), 'discounted_price')
$multipart.Add((New-Object System.Net.Http.StringContent('true')), 'featured')
$multipart.Add((New-Object System.Net.Http.StringContent('true')), 'newArrival')
$multipart.Add((New-Object System.Net.Http.StringContent('true')), 'todaysSpecial')

# IDs
$multipart.Add((New-Object System.Net.Http.StringContent('a48251fa-5966-4b0b-b06e-7e42265ea8b4')), 'category_id')
$multipart.Add((New-Object System.Net.Http.StringContent('0307ce47-0d9f-4b00-a14e-79581e172fb7')), 'subcategory_id')
$multipart.Add((New-Object System.Net.Http.StringContent('1eac81ec-cc20-4544-9f5b-a58fad92993d')), 'subsubcategory_id')

# Variants as JSON
$variantsJson = '[{"label":"","value":"","price":"100","extra":"","isDefault":false,"weight":"1kg","serves":"8 people","originalPrice":"100"},{"isDefault":true,"weight":"500 gram","serves":"10 people","price":"50","originalPrice":"50"}]'
$multipart.Add((New-Object System.Net.Http.StringContent($variantsJson, [System.Text.Encoding]::UTF8, 'application/json')), 'variants')

# Files: supply absolute paths to sample files on disk
$mainImagePath = Join-Path (Get-Location) 'src\data\product_images\main\type-1.png'
$gallery1 = Join-Path (Get-Location) 'src\data\product_images\gallery\type-1-g1.png'
$gallery2 = Join-Path (Get-Location) 'src\data\product_images\gallery\type-1-g2.png'

foreach ($p in @($mainImagePath, $gallery1, $gallery2)) {
  if (-not (Test-Path $p)) { Write-Host "Skipping missing file: $p"; continue }
  $fileStream = [System.IO.File]::OpenRead($p)
  $streamContent = New-Object System.Net.Http.StreamContent($fileStream)
  $streamContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('image/png')
  $name = if ($p -eq $mainImagePath) { 'mainImage' } else { 'galleryImages[]' }
  $multipart.Add($streamContent, $name, [System.IO.Path]::GetFileName($p))
}

Write-Host 'Sending request...'
$resp = $client.PostAsync($url, $multipart).GetAwaiter().GetResult()
if ($resp.IsSuccessStatusCode) {
  $text = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
  Write-Host "Success: $($resp.StatusCode)"; Write-Host $text
  Write-Host 'Redirect to product page (example): /admin/inventory/products'  # Replace with returned product slug/id
} else {
  $text = $resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
  Write-Host "Error: $($resp.StatusCode)"; Write-Host $text
}

# Cleanup
$client.Dispose()
