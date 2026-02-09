$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password"
    password_confirmation = "password"
    company_name = "Test Company"
    company_email = "company@example.com"
    company_phone = "555-1234"
    company_address = "123 Main St"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/register' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Response:"
    Write-Host $_.Exception.Response.GetResponseStream() | Get-Content
}
