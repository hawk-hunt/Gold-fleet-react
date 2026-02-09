# Gold Fleet - Authentication System Setup

## Overview
This document describes the authentication system implemented for the Gold Fleet application. The system uses a token-based API for authentication between the React frontend and Laravel backend.

## Architecture

### Backend (Laravel)
- **Token Storage**: `api_token` column in users table (80 chars, unique, nullable)
- **Auth Controller**: `App\Http\Controllers\Api\AuthController`
- **Middleware**: `AuthorizeApiToken` for validating tokens on protected routes
- **Auth Routes** (in `routes/api.php`):
  - `POST /api/login` - Public, returns token
  - `POST /api/register` - Public, returns token
  - `POST /api/logout` - Protected, clears token
  - `GET /api/user` - Protected, returns user info

### Frontend (React)
- **Auth Context**: `src/context/AuthContext.jsx` - Global auth state
- **Protected Routes**: `src/components/ProtectedRoute.jsx` - Token-based access control
- **Auth Page**: `src/pages/AuthPage.jsx` - Login/Signup UI with tab switching
- **Token Storage**: `localStorage` with key `auth_token`
- **Auth Persistence**: Token checked on app load

## API Endpoints

### Login
```
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "success": true,
  "message": "Logged in successfully",
  "token": "...",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin",
    "company_id": 1
  }
}
```

### Register
```
POST /api/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password",
  "password_confirmation": "password",
  "company_name": "Company Name",
  "company_email": "company@example.com",
  "company_phone": "555-1234",        // optional
  "company_address": "123 Main St"    // optional
}

Response:
{
  "success": true,
  "message": "Registered successfully",
  "token": "...",
  "user": { ... },
  "company": { ... }
}
```

### Get Current User
```
GET /api/user
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": { ... }
}
```

### Logout
```
POST /api/logout
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Protected Routes

All routes below are protected with the `auth:api` middleware:
- `/api/logout`
- `/api/user`
- `/api/dashboard/info/chart-data`
- `/api/vehicle-locations`
- All resource endpoints (vehicles, drivers, trips, services, inspections, issues, expenses, fuel-fillups, reminders)
- `/api/profile/*`
- `/api/notifications/*`

## Frontend Routes

### Public
- `/` - Landing page
- `/login` - Auth page (login tab)
- `/signup` - Auth page (signup tab)

### Protected (require valid token)
- `/dashboard` - Main dashboard
- `/dashboard/map` - Map view
- `/dashboard/info` - Info dashboard
- `/vehicles/*` - Vehicle management
- `/drivers/*` - Driver management
- `/trips/*` - Trip management
- `/services/*` - Service management
- `/inspections/*` - Inspection management
- `/issues/*` - Issue management
- `/expenses/*` - Expense management
- `/fuel-fillups/*` - Fuel fillup management
- `/reminders/*` - Reminder management
- `/profile` - User profile
- `/notifications` - Notifications

## Setup Instructions

### Prerequisites
- Node.js 16+ (frontend)
- PHP 8.2+ (backend)
- Laravel 12.x
- SQLite or MySQL database

### Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Run migrations
php artisan migrate

# Start dev server
php artisan serve
```

Backend will be available at `http://localhost:8000`

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Testing the Auth Flow

### Manual Testing (Browser)
1. Navigate to `http://localhost:5173`
2. Click "Sign Up" tab on the auth page
3. Fill in user and company details
4. Click "Create Account"
5. You should be redirected to `/dashboard`
6. Refresh the page - you should remain logged in
7. Click logout in the header
8. You should be redirected to `/login`

### API Testing (cURL)
```bash
# Register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "password_confirmation": "password",
    "company_name": "Acme Corp",
    "company_email": "company@example.com"
  }'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password"
  }'

# Get user (use token from login response)
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer {token}"

# Logout
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer {token}"
```

## Key Implementation Details

### Token Generation
Tokens are generated using `Str::random(80)` and stored in the `api_token` column.

### Token Validation
The `AuthorizeApiToken` middleware:
1. Extracts token from `Authorization: Bearer {token}` header
2. Looks up user with matching token
3. Sets authenticated user using `Auth::setUser()`

### Auth Context
The `AuthContext` provides:
- `user` - Current user object
- `token` - Current auth token
- `loading` - Loading state during auth check
- `login()` - Login function
- `signup()` - Register function
- `logout()` - Logout function

### Protected Routes
`ProtectedRoute` component:
- Checks if token exists
- Redirects to `/login` if not authenticated
- Shows loading spinner while checking auth
- Allows access if authenticated

## CORS & API Communication

The frontend communicates with the backend at `http://localhost:8000` (defined in `AuthContext.jsx`).

If you change the backend URL, update:
- `AuthContext.jsx` - All `fetch()` calls to `http://localhost:8000/api/...`

## Error Handling

### Login/Signup Errors
- Invalid credentials → 401 error message displayed
- Validation errors → Error message from backend
- Network errors → Generic error message

### Protected Route Errors
- No token → Redirect to `/login`
- Invalid token → Token cleared, redirect to `/login`
- Expired token → Redirect to `/login` on next request

## Notes

- Tokens never expire in this implementation (consider adding expiration for production)
- Tokens are stored in plain localStorage (use httpOnly cookies for production)
- Add password reset functionality as needed
- Add email verification as needed
- Consider implementing refresh tokens for better security
