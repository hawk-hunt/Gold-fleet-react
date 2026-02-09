$body = @{
    email = "test@example.com"
    password = "password"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:8000/api/login' -Method POST -ContentType 'application/json' -Body $body

Write-Host $response.Content
