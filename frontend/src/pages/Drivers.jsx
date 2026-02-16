import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ListPage from '../components/ListPage';

export default function Drivers() {
  return (
    <ListPage
      title="Drivers"
      fetchData={() => api.getDrivers().then(r => r.data)}
      deleteItem={api.deleteDriver}
      createUrl="/drivers/create"
      viewUrl={(id) => `/drivers/${id}`}
      editUrl={(id) => `/drivers/${id}/edit`}
      columns={[
        { label: 'Name', transform: d => d.user?.name || d.name || 'Unknown' },
        { label: 'Email', transform: d => d.user?.email || d.email || '-' },
        { label: 'Phone', key: 'phone' },
        { label: 'License', key: 'license_number' },
        { label: 'Status', transform: d => (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              d.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {d.status || 'Active'}
            </span>
          )},
      ]}
    />
  );
}
