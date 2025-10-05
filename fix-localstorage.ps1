# PowerShell script to fix all localStorage issues in Redux store files

# Add import for localStorage utility at the top of each store file
Get-ChildItem -Path "src\store\*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Skip if already has the import
    if ($content -notmatch "getAuthToken") {
        # Add import after existing imports
        $content = $content -replace "(import.*?;\s*\n)", "`$1import { getAuthToken } from '../utils/localStorage';`n"
        
        # Replace direct localStorage.getItem calls with getAuthToken() in async thunks
        $content = $content -replace "const token = localStorage\.getItem\('access_token'\);", "const token = getAuthToken();"
        
        # Replace localStorage calls inside functions
        $content = $content -replace "localStorage\.getItem\('access_token'\)", "getAuthToken()"
        
        # Write back to file
        Set-Content -Path $_.FullName -Value $content -NoNewline
        Write-Host "Fixed localStorage in $($_.Name)"
    }
}

Write-Host "All localStorage issues fixed!"