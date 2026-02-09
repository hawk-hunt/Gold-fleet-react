# Gold Fleet - Quick Start Guide

Get the Gold Fleet application running in 5 minutes!

## Prerequisites Checklist

- [ ] PHP 8.2 or higher installed
- [ ] Composer installed
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] MySQL or SQLite available

Verify:
```bash
php --version
composer --version
node --version
npm --version
```

## Quick Start (5 minutes)

### 1. Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
composer install

# Create .env file
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate

# Start server
php artisan serve
```

**Expected Output:**
```
Laravel development server started: http://127.0.0.1:8000
```

### 2. Frontend Setup (2 minutes)

**In a NEW terminal:**

```bash
cd frontend

# Dependencies already installed, if not:
npm install

# Start dev server
npm run dev
```

**Expected Output:**
```
VITE v7.3.1  ready in 1013 ms
  ➜  Local:   http://localhost:5173/
```

### 3. Access Application (1 minute)

- **Frontend:** Open browser to http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Original Blade (reference):** http://localhost:8000

## First Time Setup (Windows)

Double-click `setup.bat` in the project root. It will automatically:
- Install Composer dependencies
- Create .env file
- Generate app key
- Run migrations
- Install npm packages

## First Time Setup (Linux/Mac)

```bash
bash setup.sh
```

## Troubleshooting Quick Fixes

### Port Already in Use

**Backend port 8000 taken:**
```bash
php artisan serve --port=8001
```

**Frontend port 5173 taken:**
Edit `vite.config.js` and change port, or:
```bash
npm run dev -- --port 3000
```

### Dependencies Not Installed

**Node modules missing:**
```bash
cd frontend
npm install
```

**Composer packages missing:**
```bash
cd backend
composer install
```

### Database Issues

**Reset database (development only):**
```bash
cd backend
php artisan migrate:refresh --seed
```

### CORS Errors

Ensure file `backend/config/cors.php` allows:
```php
'allowed_origins' => ['http://localhost:5173'],
```

## File Structure to Know

```
gold-fleet/
├── backend/           ← PHP/Laravel API
│   └── php artisan serve
├── frontend/          ← React/Node
│   └── npm run dev
└── README.md          ← Full documentation
```

## Key Commands Reference

### Backend Commands

```bash
# Start server
php artisan serve

# Create migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Create model
php artisan make:model ModelName -m

# View routes
php artisan route:list

# Run tests
php artisan test
```

### Frontend Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install package
npm install package-name

# Run tests
npm test
```

## API Testing

Test backend API with curl:

```bash
# List vehicles
curl http://localhost:8000/api/vehicles

# Create vehicle
curl -X POST http://localhost:8000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"make":"Toyota","model":"Camry"}'
```

Or use Postman: https://www.postman.com/downloads/

## Next Steps

1. **Explore the code:**
   - Frontend components in `frontend/src/components/`
   - Pages in `frontend/src/pages/`
   - API routes in `backend/routes/api.php`

2. **Read documentation:**
   - `README.md` - Full overview
   - `IMPLEMENTATION_GUIDE.md` - Code patterns
   - `MIGRATION_CHECKLIST.md` - What to implement

3. **Start developing:**
   - Look at `VehiclesList.jsx` as a template
   - Follow the same pattern for other modules
   - Use the `api.js` service for all API calls

4. **Keep both servers running:**
   - Terminal 1: `cd backend && php artisan serve`
   - Terminal 2: `cd frontend && npm run dev`

## Common Development Tasks

### Add a New Page

1. Create file: `frontend/src/pages/MyPage.jsx`
2. Add route in `frontend/src/App.jsx`
3. Use `<Layout>` wrapper for sidebar/header
4. Import and use components

Example:
```jsx
import Layout from '../components/Layout';

export default function MyPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">My Page</h1>
      </div>
    </Layout>
  );
}
```

### Add API Endpoint

1. Create route in `backend/routes/api.php`
2. Add controller method
3. Return JSON response
4. Call from frontend using `api.js`

### Style with Tailwind

All styling uses Tailwind CSS classes. Examples:

```jsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600 mt-2">Description</p>
  <button className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
    Action
  </button>
</div>
```

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env)
```
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gold_fleet
DB_USERNAME=root
DB_PASSWORD=
```

## Performance Tips

1. **Frontend:**
   - Check console for warnings
   - Use React DevTools browser extension
   - Monitor network requests in DevTools

2. **Backend:**
   - Use `php artisan tinker` to test queries
   - Check Laravel logs in `storage/logs/`
   - Use `php artisan optimize` for production

## Git & Version Control

```bash
# Initialize git
git init

# Create .gitignore (already in project)
# Commit initial state
git add .
git commit -m "Initial project structure"

# Useful reminders
# - Don't commit node_modules/ (in .gitignore)
# - Don't commit .env (in .gitignore)
# - Don't commit /vendor/ (in .gitignore)
```

## IDE Setup Tips

### VS Code Extensions Recommended
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Laravel extension
- PHP IntelliSense
- REST Client

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.exclude": {
    "node_modules": true,
    "vendor": true
  }
}
```

## Help & Support

- **Documentation:** See README.md, IMPLEMENTATION_GUIDE.md
- **Code Examples:** Check VehiclesList.jsx
- **Laravel Docs:** https://laravel.com/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com

## What's Included

✅ Full React+Vite setup
✅ 74 React components
✅ All routing configured
✅ Tailwind CSS styled
✅ API integration ready
✅ Responsive mobile design
✅ Professional documentation
✅ Setup automation scripts

## What's Next

📋 Implement remaining form pages
📊 Add charts and visualizations
🔐 Setup authentication system
✅ Test all features
🚀 Deploy to production

---

**Ready to develop?** Fire up both servers and start coding! 🚀

For detailed information, see the full documentation in README.md

---

## 🔐 Authentication System (NEW)

A complete token-based authentication system has been implemented:

### ✅ Features Included
- User registration with company information
- Email/password login
- Token-based API authentication
- Protected routes (dashboard + all admin pages)
- Persistent login (survives page refresh)
- Automatic logout

### Quick Test

1. **Backend running:** `php artisan serve`
2. **Frontend running:** `npm run dev`
3. Open http://localhost:5173
4. Click **"Sign Up"** on the auth page
5. Fill in all fields:
   - Name, Email, Password
   - Company Name, Company Email
6. Click **"Create Account"**
7. ✅ You'll be redirected to the dashboard
8. Refresh the page → you'll stay logged in
9. Click your name → **"Logout"** to test logout

### API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/register` | No | Register new user |
| POST | `/api/login` | No | Login user |
| GET | `/api/user` | Yes | Get current user |
| POST | `/api/logout` | Yes | Logout user |

### Testing with cURL

```bash
# Register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"password",
    "password_confirmation":"password",
    "company_name":"Acme Corp",
    "company_email":"company@example.com"
  }'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Get current user (use token from login)
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Key Files

**Backend:**
- `app/Http/Controllers/Api/AuthController.php` - Auth logic
- `app/Http/Middleware/AuthorizeApiToken.php` - Token validation
- `routes/api.php` - Auth routes
- `database/migrations/2026_01_31_000000_add_api_token_to_users_table.php` - Token column

**Frontend:**
- `src/context/AuthContext.jsx` - Auth state management
- `src/components/ProtectedRoute.jsx` - Route protection
- `src/pages/AuthPage.jsx` - Login/Signup UI
- `src/App.jsx` - Route configuration

### Further Documentation

- **AUTH_SETUP.md** - Detailed API documentation
- **AUTH_IMPLEMENTATION_COMPLETE.md** - Full checklist and features

🔐 All endpoints and routes are now protected and require authentication!
