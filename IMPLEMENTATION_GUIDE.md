# Gold Fleet - React Implementation Guide

## Complete Component Inventory

### ✅ Completed Components

#### Core Layout (3 files)
- `src/components/Layout.jsx` - Main layout wrapper with flex container
- `src/components/Sidebar.jsx` - Responsive sidebar navigation with active route detection
- `src/components/Header.jsx` - Header with notifications, profile dropdown, and mobile menu

#### Dashboard Pages (2 files)
- `src/pages/Dashboard.jsx` - Main dashboard with stat cards and placeholder charts
- `src/pages/MapDashboard.jsx` - Map dashboard placeholder
- `src/pages/InfoDashboard.jsx` - Information dashboard placeholder
- `src/pages/Profile.jsx` - User profile page placeholder
- `src/pages/Notifications.jsx` - Notifications page placeholder

#### Vehicles Module (4 files)
- `src/pages/Vehicles/VehiclesList.jsx` - **COMPLETE** List with table, filters, pagination ready
- `src/pages/Vehicles/VehicleShow.jsx` - View single vehicle (stub)
- `src/pages/Vehicles/VehicleCreate.jsx` - Create vehicle form (stub)
- `src/pages/Vehicles/VehicleEdit.jsx` - Edit vehicle form (stub)

#### Drivers Module (4 files)
- `src/pages/Drivers/DriversList.jsx` - Drivers list (stub)
- `src/pages/Drivers/DriverShow.jsx` - View driver (stub)
- `src/pages/Drivers/DriverCreate.jsx` - Create driver (stub)
- `src/pages/Drivers/DriverEdit.jsx` - Edit driver (stub)

#### Trips Module (4 files)
- `src/pages/Trips/TripsList.jsx` - Trips list (stub)
- `src/pages/Trips/TripsShow.jsx` - View trip (stub)
- `src/pages/Trips/TripsCreate.jsx` - Create trip (stub)
- `src/pages/Trips/TripsEdit.jsx` - Edit trip (stub)

#### Services Module (4 files)
- `src/pages/Services/ServicesList.jsx` - Services list (stub)
- `src/pages/Services/ServicesShow.jsx` - View service (stub)
- `src/pages/Services/ServicesCreate.jsx` - Create service (stub)
- `src/pages/Services/ServicesEdit.jsx` - Edit service (stub)

#### Inspections Module (4 files)
- `src/pages/Inspections/InspectionsList.jsx` - Inspections list (stub)
- `src/pages/Inspections/InspectionsShow.jsx` - View inspection (stub)
- `src/pages/Inspections/InspectionsCreate.jsx` - Create inspection (stub)
- `src/pages/Inspections/InspectionsEdit.jsx` - Edit inspection (stub)

#### Issues Module (4 files)
- `src/pages/Issues/IssuesList.jsx` - Issues list (stub)
- `src/pages/Issues/IssuesShow.jsx` - View issue (stub)
- `src/pages/Issues/IssuesCreate.jsx` - Create issue (stub)
- `src/pages/Issues/IssuesEdit.jsx` - Edit issue (stub)

#### Expenses Module (4 files)
- `src/pages/Expenses/ExpensesList.jsx` - Expenses list (stub)
- `src/pages/Expenses/ExpensesShow.jsx` - View expense (stub)
- `src/pages/Expenses/ExpensesCreate.jsx` - Create expense (stub)
- `src/pages/Expenses/ExpensesEdit.jsx` - Edit expense (stub)

#### Fuel Fillups Module (4 files)
- `src/pages/FuelFillups/FuelFillupsList.jsx` - Fuel fillups list (stub)
- `src/pages/FuelFillups/FuelFillupShow.jsx` - View fillup (stub)
- `src/pages/FuelFillups/FuelFillupCreate.jsx` - Create fillup (stub)
- `src/pages/FuelFillups/FuelFillupEdit.jsx` - Edit fillup (stub)

#### Reminders Module (4 files)
- `src/pages/Reminders/RemindersList.jsx` - Reminders list (stub)
- `src/pages/Reminders/RemindersShow.jsx` - View reminder (stub)
- `src/pages/Reminders/RemindersCreate.jsx` - Create reminder (stub)
- `src/pages/Reminders/RemindersEdit.jsx` - Edit reminder (stub)

#### API Service (1 file)
- `src/services/api.js` - Centralized API client with all CRUD methods

#### Main Application (1 file)
- `src/App.jsx` - React Router setup with all routes

**Total: 74 React components created**

## Styling System

### Tailwind CSS Implementation

All components use **Tailwind CSS v3** with the following color scheme:

#### Color Palette
```css
Primary: yellow-500 (#FBBF24) - Brand accent
Background: gray-100, gray-900 (light/dark)
Text: gray-900, gray-600, gray-500 (hierarchy)
Success: green-100/600/800
Warning: yellow-100/600/800
Error: red-100/600/800
Info: blue-100/600/800
```

#### Common Tailwind Classes Used

**Layout:**
- `flex h-screen overflow-hidden` - Full viewport container
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6` - Responsive grids
- `absolute inset-y-0 left-0 lg:static` - Responsive positioning

**Cards & Containers:**
- `bg-white rounded-lg shadow p-6` - Standard card
- `bg-white rounded-lg shadow-sm border border-gray-200` - Card with border
- `bg-gray-50` - Light background

**Typography:**
- `text-2xl font-bold text-gray-900` - Headings
- `text-sm font-medium text-gray-600` - Labels
- `text-xs text-gray-500 uppercase tracking-wider` - Section headers

**States & Interactions:**
- `hover:bg-gray-800 hover:text-blue-900` - Hover effects
- `focus:outline-none focus:ring-2 focus:ring-yellow-500` - Focus states
- `transition-colors transition-all duration-300` - Animations

**Responsive Design:**
- `hidden md:block lg:hidden` - Responsive visibility
- `lg:ml-0 ml-4` - Mobile-first spacing
- `absolute lg:static` - Layout shifts

### Icon System

All icons are **Heroicons** (SVG) with:
- Size: `w-5 h-5` (default), `w-6 h-6` (large), `w-4 h-4` (small)
- Color: Inherit from parent via `fill="currentColor"` or `stroke="currentColor"`
- ViewBox: `"0 0 20 20"` (standard)

## Component Patterns

### 1. List Components Pattern

**Example: VehiclesList.jsx**

```jsx
export default function VehiclesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        setItems(data.data || []);
      } catch (error) {
        console.error('Failed to load:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      {/* Header with title + action button */}
      {/* Table with loading/empty states */}
      {/* Action links: View, Edit, Delete */}
    </div>
  );
}
```

**Key Features:**
- useEffect for data fetching on mount
- Loading state during fetch
- Empty state with action button
- Table with hover effects
- Action links (View, Edit, Delete)

### 2. Navigation Pattern

**Sidebar Active Route Detection:**

```jsx
import { useLocation, Link } from 'react-router-dom';

const location = useLocation();
const isActive = (path) => location.pathname.startsWith(path);

<Link
  to="/vehicles"
  className={isActive('/vehicles') 
    ? 'bg-gray-800 border-l-4 border-yellow-500' 
    : 'border-l-4 border-transparent'}
/>
```

### 3. API Integration Pattern

**In any component:**

```jsx
import api from '../services/api';

// Fetch data
const vehicles = await api.getVehicles();

// Create
const newVehicle = await api.createVehicle({ name: 'Truck' });

// Update
await api.updateVehicle(id, { name: 'Updated Truck' });

// Delete
await api.deleteVehicle(id);
```

### 4. Modal/Dropdown Pattern

**Header Notifications:**

```jsx
const [notificationsOpen, setNotificationsOpen] = useState(false);

{notificationsOpen && (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg">
    {/* Content */}
  </div>
)}

{/* Close backdrop */}
{notificationsOpen && (
  <div 
    className="fixed inset-0 z-40" 
    onClick={() => setNotificationsOpen(false)}
  />
)}
```

### 5. Form Input Pattern

**Standard Input with Label:**

```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Vehicle Name
  </label>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
  />
</div>
```

### 6. Status Badge Pattern

```jsx
<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
  status === 'active' ? 'bg-green-100 text-green-800' :
  status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
  'bg-red-100 text-red-800'
}`}>
  {status.charAt(0).toUpperCase() + status.slice(1)}
</span>
```

## Blade to React Conversion Examples

### Example 1: Loop with Conditional

**Blade:**
```blade
@forelse($vehicles as $vehicle)
  <tr>
    <td>{{ $vehicle->make }} {{ $vehicle->model }}</td>
    <td>
      @if($vehicle->status === 'active')
        <span class="badge badge-success">Active</span>
      @else
        <span class="badge badge-danger">Inactive</span>
      @endif
    </td>
  </tr>
@empty
  <tr><td>No vehicles found</td></tr>
@endforelse
```

**React:**
```jsx
{vehicles.length === 0 ? (
  <tr><td>No vehicles found</td></tr>
) : (
  vehicles.map(vehicle => (
    <tr key={vehicle.id}>
      <td>{vehicle.make} {vehicle.model}</td>
      <td>
        <span className={vehicle.status === 'active' ? 'badge-success' : 'badge-danger'}>
          {vehicle.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </td>
    </tr>
  ))
)}
```

### Example 2: Alpine.js Toggle to React Hook

**Blade:**
```blade
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" x-transition>Content</div>
</div>
```

**React:**
```jsx
const [open, setOpen] = useState(false);

<div>
  <button onClick={() => setOpen(!open)}>Toggle</button>
  {open && <div style={{ transition: 'all 0.3s' }}>Content</div>}
</div>
```

### Example 3: Laravel Route to React Router

**Blade:**
```blade
<a href="{{ route('vehicles.edit', $vehicle->id) }}">Edit</a>
```

**React:**
```jsx
<Link to={`/vehicles/${vehicle.id}/edit`}>Edit</Link>
```

## Routing Structure

All routes follow RESTful convention:

```
GET    /vehicles              → List all
GET    /vehicles/:id          → Show single
GET    /vehicles/create       → Show create form
POST   /vehicles              → Store new (backend)
GET    /vehicles/:id/edit     → Show edit form
PATCH  /vehicles/:id          → Update (backend)
DELETE /vehicles/:id          → Delete (backend)
```

**React Router implementation in App.jsx:**
```jsx
<Route path="/vehicles" element={<Layout><VehiclesList /></Layout>} />
<Route path="/vehicles/:id" element={<Layout><VehicleShow /></Layout>} />
<Route path="/vehicles/create" element={<Layout><VehicleCreate /></Layout>} />
<Route path="/vehicles/:id/edit" element={<Layout><VehicleEdit /></Layout>} />
```

## Frontend-Backend Integration

### API Response Format Expected

**List endpoint:**
```json
{
  "data": [
    { "id": 1, "name": "Truck 1", ... },
    { "id": 2, "name": "Truck 2", ... }
  ],
  "pagination": { "total": 50, "per_page": 15, "current_page": 1 }
}
```

**Single item endpoint:**
```json
{
  "data": { "id": 1, "name": "Truck 1", ... }
}
```

**Error format:**
```json
{
  "message": "Validation error",
  "errors": {
    "name": ["The name field is required."]
  }
}
```

## File Organization

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── (shared components)
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── MapDashboard.jsx
│   │   ├── InfoDashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Notifications.jsx
│   │   └── (modules)
│   │       ├── Vehicles/
│   │       │   ├── VehiclesList.jsx
│   │       │   ├── VehicleShow.jsx
│   │       │   ├── VehicleCreate.jsx
│   │       │   └── VehicleEdit.jsx
│   │       ├── Drivers/
│   │       ├── Trips/
│   │       ├── Services/
│   │       ├── Inspections/
│   │       ├── Issues/
│   │       ├── Expenses/
│   │       ├── FuelFillups/
│   │       └── Reminders/
│   ├── services/
│   │   └── api.js
│   ├── assets/
│   │   ├── background-image/
│   │   ├── background-video/
│   │   └── react.svg
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## Development Tips

1. **Use the VehiclesList as a template** for implementing other list pages
2. **Install additional packages as needed:**
   - `recharts` for charts
   - `react-hook-form` for forms
   - `zod` for validation
   - `react-table` for complex tables

3. **Environment variables in .env:**
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Common hooks pattern:**
   ```jsx
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
     const fetch = async () => {
       try { /* ... */ } 
       catch (e) { setError(e); } 
       finally { setLoading(false); }
     };
     fetch();
   }, []);
   ```

## Next Steps for Implementation

1. **Priority 1: Core Pages**
   - Implement VehiclesList as template
   - Implement Drivers list using same pattern
   - Implement Trips, Services, Inspections

2. **Priority 2: CRUD Forms**
   - Create, Edit pages for each module
   - Form validation and error handling
   - Success/error messages

3. **Priority 3: Dashboard Features**
   - Charts integration (Recharts)
   - Real-time stats updates
   - Map integration for MapDashboard

4. **Priority 4: Polish**
   - Loading states and skeletons
   - Pagination
   - Search/filter functionality
   - Responsive mobile improvements

## Troubleshooting Common Issues

**Issue: API calls getting 404**
- Solution: Verify backend running on localhost:8000
- Check vite proxy config in vite.config.js

**Issue: Tailwind styles not applied**
- Solution: Restart dev server
- Check content paths in tailwind.config.js

**Issue: Images not loading from assets**
- Solution: Use proper imports: `import img from './assets/...jpg'`
- Or use public folder for static assets

**Issue: Route not working**
- Solution: Verify App.jsx has the route defined
- Check path syntax matches browser URL exactly
