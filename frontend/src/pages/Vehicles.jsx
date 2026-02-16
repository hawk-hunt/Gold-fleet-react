import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ListPage from '../components/ListPage';

export default function Vehicles() {
  return (
    <ListPage
      title="Vehicles"
      fetchData={() => api.getVehicles().then(r => r.data)}
      deleteItem={api.deleteVehicle}
      createUrl="/vehicles/create"
      viewUrl={(id) => `/vehicles/${id}`}
      editUrl={(id) => `/vehicles/${id}/edit`}
      columns={[
        { label: 'License Plate', key: 'license_plate' },
        { label: 'Make/Model', transform: v => `${v.make || ''} ${v.model || ''}` },
        { label: 'Year', key: 'year' },
        { label: 'Mileage', transform: v => v.mileage ? `${Number(v.mileage).toLocaleString()} mi` : '-' },
        { label: 'Status', transform: v => (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              v.status === 'active'
                ? 'bg-green-100 text-green-800'
                : v.status === 'maintenance'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {v.status || 'Active'}
            </span>
          )},
      ]}
    />
  );
}
