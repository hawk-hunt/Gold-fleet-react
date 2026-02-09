#!/bin/bash

# Quick test to verify auth endpoints are working

echo "Testing Auth API Endpoints..."
echo ""

# Test register
echo "1. Testing POST /api/register"
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "company_name": "Test Company",
    "company_email": "company@example.com",
    "company_phone": "555-1234",
    "company_address": "123 Main St"
  }' | jq .
echo ""
echo ""

# Test login
echo "2. Testing POST /api/login"
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq .
echo ""

