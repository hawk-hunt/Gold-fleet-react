import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import ListPage from '../components/ListPage';

export default function FuelFillups() {
  return (
    <ListPage
      title="Fuel Fillups"
      fetchData={() => api.getFuelFillups().then(r => r.data)}
      deleteItem={api.deleteFuelFillup}
      createUrl="/fuel-fillups/create"
      viewUrl={id => `/fuel-fillups/${id}`}
      editUrl={id => `/fuel-fillups/${id}/edit`}
      columns={[
        { label: 'Vehicle', transform: f => f.vehicle?.license_plate || '-' },
        { label: 'Date', key: 'fillup_date' },
        { label: 'Gallons', transform: f => f.gallons ? `${f.gallons} gal` : '-' },
        { label: 'Cost', transform: f => formatCurrency(f.cost) },
      ]}
    />
  );
}
