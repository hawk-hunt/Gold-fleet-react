import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import ListPage from '../components/ListPage';

export default function Services() {
  return (
    <ListPage
      title="Services"
      fetchData={() => api.getServices().then(r => r.data)}
      deleteItem={api.deleteService}
      createUrl="/services/create"
      viewUrl={id => `/services/${id}`}
      editUrl={id => `/services/${id}/edit`}
      columns={[
        { label: 'Service Type', transform: s => s.service_type?.replace('_',' ') || '-' },
        { label: 'Vehicle', transform: s => `${s.vehicle?.make || ''} ${s.vehicle?.model || ''} (${s.vehicle?.license_plate || '-'})` },
        { label: 'Date', transform: s => s.service_date ? new Date(s.service_date).toLocaleDateString() : '-' },
        { label: 'Status', transform: s => (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              s.status === 'completed' ? 'bg-green-100 text-green-800' : s.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {s.status?.replace('_',' ') || 'Pending'}
            </span>
          )},
        { label: 'Cost', transform: s => formatCurrency(s.cost) },
      ]}
    />
  );
}
