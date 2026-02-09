# Gold Fleet - Restructured Architecture

This project has been restructured into a modern separated architecture with a React frontend and Laravel API backend.

## Project Structure

```
gold-fleet/
├── backend/          # Laravel API
│   ├── app/
│   ├── routes/
│   ├── config/
│   ├── database/
│   ├── resources/    # Keep for reference during dev
│   ├── public/
│   ├── composer.json
│   └── artisan
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/      # Page components
    │   ├── services/   # API services
    │   ├── assets/     # Images, videos, icons
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## Setup Instructions

### Backend (Laravel API)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Laravel dependencies:
   ```bash
   composer install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Setup database:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   Laravel will run on `http://localhost:8000`

### Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   React will run on `http://localhost:5173`

## API Endpoints

The frontend communicates with the Laravel backend API at `http://localhost:8000/api`.

### Key Routes

- **Vehicles**: `/api/vehicles`
- **Drivers**: `/api/drivers`
- **Trips**: `/api/trips`
- **Services**: `/api/services`
- **Inspections**: `/api/inspections`
- **Issues**: `/api/issues`
- **Expenses**: `/api/expenses`
- **Fuel Fillups**: `/api/fuel-fillups`
- **Reminders**: `/api/reminders`
- **Dashboard**: `/api/dashboard`
- **Notifications**: `/api/notifications`

## Component Structure

### Layout Components
- `Layout.jsx` - Main wrapper with sidebar and header
- `Sidebar.jsx` - Navigation menu
- `Header.jsx` - Top bar with notifications and profile

### Page Components
All pages are organized by feature:
- `pages/Dashboard.jsx` - Main dashboard
- `pages/Vehicles/` - Vehicle CRUD pages
- `pages/Drivers/` - Driver CRUD pages
- `pages/Trips/` - Trip CRUD pages
- And similar structure for Services, Inspections, Issues, Expenses, Fuel Fillups, Reminders

### Styling

The project uses **Tailwind CSS** for styling:
- All components use Tailwind utility classes
- Color scheme matches the original Laravel UI (yellow accent #FBBF24)
- Responsive design with mobile-first approach
- All CSS classes are applied via Tailwind (no custom CSS except global styles)

## Migration from Blade to React

### Key Patterns Converted

1. **Blade @extends → React Layout Wrapper**
   ```blade
   @extends('layouts.app')
   ```
   Becomes:
   ```jsx
   <Layout><PageComponent /></Layout>
   ```

2. **Blade @include → React Component Import**
   ```blade
   @include('partials.sidebar')
   ```
   Becomes:
   ```jsx
   import Sidebar from './Sidebar'
   ```

3. **Blade {{ }} → JSX { }**
   ```blade
   {{ $variable }}
   ```
   Becomes:
   ```jsx
   {variable}
   ```

4. **Blade @if/@foreach → JS Conditionals/Map**
   ```blade
   @foreach($items as $item)
     {{ $item->name }}
   @endforeach
   ```
   Becomes:
   ```jsx
   {items.map(item => <div key={item.id}>{item.name}</div>)}
   ```

5. **Alpine.js → React Hooks**
   ```blade
   x-data="{ open: false }"
   @click="open = !open"
   x-show="open"
   ```
   Becomes:
   ```jsx
   const [open, setOpen] = useState(false);
   onClick={() => setOpen(!open)}
   {open && <Component />}
   ```

6. **Laravel Routes → React Router**
   ```blade
   {{ route('vehicles.index') }}
   ```
   Becomes:
   ```jsx
   <Link to="/vehicles">
   ```

## API Integration

All API calls are centralized in `src/services/api.js`:

```javascript
import api from './services/api';

const vehicles = await api.getVehicles();
const newVehicle = await api.createVehicle(data);
await api.updateVehicle(id, data);
await api.deleteVehicle(id);
```

## Development Workflow

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && php artisan serve
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000/api`
   - Blade pages (reference): `http://localhost:8000`

3. **Build for production:**
   ```bash
   # Frontend
   cd frontend && npm run build
   
   # Backend (standard Laravel)
   cd backend && php artisan config:cache
   ```

## CORS Configuration

If you encounter CORS issues, update `config/cors.php` in the Laravel backend:

```php
'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
```

## Assets

All images, videos, and icons are stored in:
- `frontend/src/assets/background-image/`
- `frontend/src/assets/background-video/`

Import them in React components:
```jsx
import image from './assets/background-image/image.jpg'

<img src={image} alt="Background" />
```

## Next Steps

1. **Complete Page Implementations**
   - Replace stub implementations with full CRUD pages
   - Add form validation and error handling
   - Implement pagination and filtering

2. **Charts & Visualizations**
   - Install `recharts` or `chart.js` wrapper
   - Implement dashboard charts
   - Real-time data updates

3. **Authentication**
   - Setup React Context or Redux for auth state
   - Implement login/logout functionality
   - Add route protection

4. **Testing**
   - Add unit tests (Jest + React Testing Library)
   - Add integration tests
   - API testing

5. **Deployment**
   - Deploy backend to a production server
   - Deploy frontend to Vercel, Netlify, or similar
   - Setup CI/CD pipeline

## Troubleshooting

### API calls returning 404
- Ensure Laravel is running on `http://localhost:8000`
- Check that API routes are properly defined in `backend/routes/api.php`
- Verify vite proxy config includes `/api` path

### Tailwind styles not showing
- Ensure vite is watching for changes
- Check `tailwind.config.js` includes correct paths
- Clear node_modules and reinstall

### CORS errors
- Update Laravel `config/cors.php` to allow frontend URL
- Ensure `Accept` and `Content-Type` headers are set in API calls

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Laravel API Documentation](https://laravel.com/docs/11/eloquent-resources)
