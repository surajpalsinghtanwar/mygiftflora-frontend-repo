param(
  [string]$ApiBase = 'http://localhost:8000',
  [string]$Token = ''
)

Write-Host "Running upload test against $ApiBase"

try {
  & powershell -NoProfile -ExecutionPolicy Bypass -File scripts\upload-product-example.ps1 -ApiBase $ApiBase -Token $Token
  $exit = $LASTEXITCODE
  if ($exit -eq 0) { Write-Host 'Upload script exited 0 (success path). Check server response above.' }
} catch {
  Write-Host 'Upload test failed:' $_.Exception.Message
}
