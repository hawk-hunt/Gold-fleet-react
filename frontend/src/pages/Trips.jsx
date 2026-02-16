import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ListPage from '../components/ListPage';

export default function Trips() {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <ListPage
      title="Trips"
      fetchData={() => api.getTrips().then(r => r.data)}
      deleteItem={api.deleteTrip}
      createUrl="/trips/create"
      viewUrl={id => `/trips/${id}`}
      editUrl={id => `/trips/${id}/edit`}
      columns={[
        { label: 'ID', transform: t => `#${t.id}` },
        { label: 'Driver', transform: t => t.driver?.user?.name || t.driver?.name || '-' },
        { label: 'Vehicle', transform: t => `${t.vehicle?.license_plate || t.vehicle?.make || ''} ${t.vehicle?.model || ''}` },
        { label: 'Date', transform: t => formatDate(t.trip_date) },
        { label: 'Distance', transform: t => t.distance ? `${Number(t.distance).toLocaleString()} mi` : '-' },
        { label: 'Status', transform: t => (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              t.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : t.status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {t.status?.replace('_', ' ') || 'Pending'}
            </span>
          )},
      ]}
    />
  );
}
