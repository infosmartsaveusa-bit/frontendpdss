# Script to create all remaining component and page files for PhishGuard frontend

$basePath = "d:/New folder/PDS - Copy/frontend-new/src"

# Create directories if they don't exist
$directories = @(
    "$basePath/components",
    "$basePath/pages",
    "$basePath/lib",
    "$basePath/hooks",
    "$basePath/components/ui"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

Write-Host "All directories created successfully!"
Write-Host "Please check the frontend-new folder for the generated structure."
Write-Host "Next steps:"
Write-Host "1. Install remaining dependencies if needed"
Write-Host "2. Run 'npm run dev' to start the development server"
Write-Host "3. The backend is already running on port 8000"
Write-Host "4. The frontend will run on port 5173"
