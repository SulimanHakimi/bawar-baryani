Write-Host "Bawar Biryani - Quick Start Script" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Checking MongoDB..." -ForegroundColor Cyan
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
    Write-Host "  You can start it with: mongod" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Cyan
npm run install-all

Write-Host ""
Write-Host "Step 3: Seeding database..." -ForegroundColor Cyan
Set-Location server
npm run seed
Set-Location ..

Write-Host ""
Write-Host "✓ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Yellow
Write-Host "  Email: admin@bawar.com"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then visit:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend: http://localhost:5000" -ForegroundColor White
