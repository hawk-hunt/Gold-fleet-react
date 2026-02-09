# Blade to React Migration Checklist

This checklist guides the conversion of remaining Blade views to React components.

## ✅ Completed Migrations

### Layout & Common Components
- [x] `layouts/app.blade.php` → `components/Layout.jsx`
- [x] `partials/sidebar.blade.php` → `components/Sidebar.jsx`
- [x] `partials/header.blade.php` → `components/Header.jsx`

### Dashboard Pages
- [x] `dashboard.blade.php` → `pages/Dashboard.jsx`
- [x] Map Dashboard → `pages/MapDashboard.jsx`
- [x] Info Dashboard → `pages/InfoDashboard.jsx`

### Vehicles Module
- [x] `vehicles/index.blade.php` → `pages/Vehicles/VehiclesList.jsx` (COMPLETE)
- [ ] `vehicles/show.blade.php` → `pages/Vehicles/VehicleShow.jsx` (Stub)
- [ ] `vehicles/create.blade.php` → `pages/Vehicles/VehicleCreate.jsx` (Stub)
- [ ] `vehicles/edit.blade.php` → `pages/Vehicles/VehicleEdit.jsx` (Stub)

## ⏳ Pending Migrations (Stubs Ready)

### Drivers Module
- [ ] `drivers/index.blade.php` → `pages/Drivers/DriversList.jsx`
- [ ] `drivers/show.blade.php` → `pages/Drivers/DriverShow.jsx`
- [ ] `drivers/create.blade.php` → `pages/Drivers/DriverCreate.jsx`
- [ ] `drivers/edit.blade.php` → `pages/Drivers/DriverEdit.jsx`

### Trips Module
- [ ] `trips/index.blade.php` → `pages/Trips/TripsList.jsx`
- [ ] `trips/show.blade.php` → `pages/Trips/TripsShow.jsx`
- [ ] `trips/create.blade.php` → `pages/Trips/TripsCreate.jsx`
- [ ] `trips/edit.blade.php` → `pages/Trips/TripsEdit.jsx`

### Services Module
- [ ] `services/index.blade.php` → `pages/Services/ServicesList.jsx`
- [ ] `services/show.blade.php` → `pages/Services/ServicesShow.jsx`
- [ ] `services/create.blade.php` → `pages/Services/ServicesCreate.jsx`
- [ ] `services/edit.blade.php` → `pages/Services/ServicesEdit.jsx`

### Inspections Module
- [ ] `inspections/index.blade.php` → `pages/Inspections/InspectionsList.jsx`
- [ ] `inspections/show.blade.php` → `pages/Inspections/InspectionsShow.jsx`
- [ ] `inspections/create.blade.php` → `pages/Inspections/InspectionsCreate.jsx`
- [ ] `inspections/edit.blade.php` → `pages/Inspections/InspectionsEdit.jsx`

### Issues Module
- [ ] `issues/index.blade.php` → `pages/Issues/IssuesList.jsx`
- [ ] `issues/show.blade.php` → `pages/Issues/IssuesShow.jsx`
- [ ] `issues/create.blade.php` → `pages/Issues/IssuesCreate.jsx`
- [ ] `issues/edit.blade.php` → `pages/Issues/IssuesEdit.jsx`

### Expenses Module
- [ ] `expenses/index.blade.php` → `pages/Expenses/ExpensesList.jsx`
- [ ] `expenses/show.blade.php` → `pages/Expenses/ExpensesShow.jsx`
- [ ] `expenses/create.blade.php` → `pages/Expenses/ExpensesCreate.jsx`
- [ ] `expenses/edit.blade.php` → `pages/Expenses/ExpensesEdit.jsx`

### Fuel Fillups Module
- [ ] `fuel_fillups/index.blade.php` → `pages/FuelFillups/FuelFillupsList.jsx`
- [ ] `fuel_fillups/show.blade.php` → `pages/FuelFillups/FuelFillupShow.jsx`
- [ ] `fuel_fillups/create.blade.php` → `pages/FuelFillups/FuelFillupCreate.jsx`
- [ ] `fuel_fillups/edit.blade.php` → `pages/FuelFillups/FuelFillupEdit.jsx`

### Reminders Module
- [ ] `reminders/index.blade.php` → `pages/Reminders/RemindersList.jsx`
- [ ] `reminders/show.blade.php` → `pages/Reminders/RemindersShow.jsx`
- [ ] `reminders/create.blade.php` → `pages/Reminders/RemindersCreate.jsx`
- [ ] `reminders/edit.blade.php` → `pages/Reminders/RemindersEdit.jsx`

### Auth Pages (if needed)
- [ ] `auth/login.blade.php` → `pages/Auth/Login.jsx`
- [ ] `auth/register.blade.php` → `pages/Auth/Register.jsx`
- [ ] `auth/forgot-password.blade.php` → `pages/Auth/ForgotPassword.jsx`

### Profile Pages
- [ ] `profile/edit.blade.php` → `pages/Profile.jsx`

## Migration Instructions

### For List/Index Pages

1. **Start with the stub file:**
   ```jsx
   export default function DriversList() {
     const [items, setItems] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       // Use api service to fetch
     }, []);

     return (
       <div className="flex-1 p-6">
         {/* Header with title and Add button */}
         {/* Table component */}
       </div>
     );
   }
   ```

2. **Use VehiclesList.jsx as template** - it has the complete pattern

3. **Replace placeholders:**
   - API endpoint: `api.getDrivers()` instead of `api.getVehicles()`
   - Table columns: Match the Blade view columns
   - Actions: View, Edit, Delete links
   - Empty state message and action

### For Show/View Pages

1. **Template structure:**
   ```jsx
   export default function DriverShow() {
     const { id } = useParams();
     const [item, setItem] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetch = async () => {
         try {
           const response = await api.getDriver(id);
           setItem(response.data);
         } catch (error) {
           console.error('Failed to load:', error);
         } finally {
           setLoading(false);
         }
       };
       fetch();
     }, [id]);

     if (loading) return <div>Loading...</div>;
     if (!item) return <div>Not found</div>;

     return (
       <div className="bg-white rounded-lg shadow p-6">
         {/* Details layout */}
       </div>
     );
   }
   ```

### For Create Pages

1. **Template structure:**
   ```jsx
   export default function DriverCreate() {
     const [formData, setFormData] = useState({ /* fields */ });
     const [errors, setErrors] = useState({});
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       try {
         const response = await api.createDriver(formData);
         navigate(`/drivers/${response.data.id}`);
       } catch (error) {
         setErrors(error.response.data.errors);
       } finally {
         setLoading(false);
       }
     };

     return (
       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
         {/* Form fields */}
       </form>
     );
   }
   ```

### For Edit Pages

1. **Combine Show + Create patterns:**
   - Fetch item on mount
   - Populate form fields
   - Submit as PUT/PATCH request
   - Redirect on success

## Common Patterns to Copy

### Table Columns Pattern
```jsx
const columns = [
  { label: 'Name', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Phone', field: 'phone' },
  { label: 'Status', field: 'status', render: (value) => <Badge status={value} /> },
  { label: 'Actions', render: (row) => <ActionLinks id={row.id} /> },
];

{columns.map(col => (
  <th key={col.field} className="px-6 py-3 text-left text-xs font-medium">
    {col.label}
  </th>
))}

{items.map(item => (
  <tr key={item.id}>
    {columns.map(col => (
      <td key={col.field} className="px-6 py-4">
        {col.render ? col.render(item[col.field], item) : item[col.field]}
      </td>
    ))}
  </tr>
))}
```

### Form Field Pattern
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
});

const [errors, setErrors] = useState({});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

<input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-yellow-500 ${
    errors.name ? 'border-red-500' : 'border-gray-300'
  }`}
/>
{errors.name && <span className="text-red-600 text-sm">{errors.name[0]}</span>}
```

### Status Badge Pattern
```jsx
const Badge = ({ status }) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
```

### Loading/Empty State Pattern
```jsx
{loading && (
  <div className="text-center py-8 text-gray-500">
    <p>Loading...</p>
  </div>
)}

{!loading && items.length === 0 && (
  <div className="text-center py-8">
    <p className="text-gray-600 mb-4">No items found</p>
    <Link to="/items/create" className="text-yellow-600 hover:text-yellow-800">
      Create one now
    </Link>
  </div>
)}

{!loading && items.length > 0 && (
  /* Table/Grid content */
)}
```

## Backend API Requirements

For each module, ensure Laravel provides these endpoints:

```
GET    /api/{module}              // List with pagination
GET    /api/{module}/{id}         // Show single item
POST   /api/{module}              // Create (expect formData)
PUT    /api/{module}/{id}         // Update
PATCH  /api/{module}/{id}         // Partial update
DELETE /api/{module}/{id}         // Delete
```

Response format:
```json
// List
{
  "data": [ { "id": 1, ... }, ... ],
  "pagination": { "total": 100, "per_page": 15, "current_page": 1 }
}

// Single
{
  "data": { "id": 1, "name": "Item", ... }
}

// Error
{
  "message": "Error message",
  "errors": { "field": [ "Error detail" ] }
}
```

## Performance Optimization Tips

1. **Memoization for list items:**
   ```jsx
   const VehicleRow = React.memo(({ vehicle }) => (
     // Row component
   ));
   ```

2. **Pagination to avoid loading all items:**
   ```jsx
   const [page, setPage] = useState(1);
   const [perPage, setPerPage] = useState(15);
   ```

3. **Debounce search:**
   ```jsx
   const [search, setSearch] = useState('');
   const debouncedSearch = useCallback(
     debounce((value) => {
       // Search API call
     }, 300),
     []
   );
   ```

## Testing Checklist

For each page, verify:
- [ ] Data loads on mount
- [ ] Loading state displays
- [ ] Empty state displays when no data
- [ ] Table displays with correct columns
- [ ] View link navigates to show page
- [ ] Edit link navigates to edit page
- [ ] Delete button shows confirmation
- [ ] Delete removes item from list
- [ ] Create button navigates to create form
- [ ] Form submits and creates item
- [ ] Errors display properly
- [ ] Responsive on mobile

## Resources

- VehiclesList.jsx - Complete list page example
- IMPLEMENTATION_GUIDE.md - Detailed patterns and examples
- README.md - Setup and deployment
- Original Blade files in backend/resources/views/ - Reference for UI/data structure
