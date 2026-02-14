import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import FilterPanel from '../components/FilterPanel';
import PaginationControls from '../components/PaginationControls';
import { useFilteredList } from '../hooks/useFilteredList';

export default function FuelFillups() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Use reusable hook for all filtering, sorting and pagination
  const {
    items,
    loading,
    error,
    pagination,
    filters,
    setFilter,
    resetFilters,
    sortBy,
    toggleSort,
    loadItems,
    handleExport,
    handleDelete,
    params,
  } = useFilteredList(
    api.getFuelFillups,
    api.exportFuelFillups,
    { sort_by: 'fillup_date', sort_dir: 'desc' }
  );

  // Load vehicles and drivers for filter dropdowns
  useEffect(() => {
    (async () => {
      try {
        const v = await api.getVehicles();
        setVehicles(v.data || v || []);
      } catch (e) {
        console.warn('Failed to load vehicles', e);
      }
      try {
        const d = await api.getDrivers();
        setDrivers(d.data || d || []);
      } catch (e) {
        console.warn('Failed to load drivers', e);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuel Fillups</h1>
          <p className="text-sm text-gray-500">Filter, sort and export fuel records</p>
        </div>
        <Link
          to="/fuel-fillups/create"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          + New Fillup
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        loading={loading}
        showExport
        onExport={handleExport}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle</label>
            <select
              value={filters.vehicle_id || ''}
              onChange={(e) => setFilter('vehicle_id', e.target.value)}
              disabled={loading}
              className="w-full rounded border px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">All vehicles</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name || v.license_plate}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Driver</label>
            <select
              value={filters.driver_id || ''}
              onChange={(e) => setFilter('driver_id', e.target.value)}
              disabled={loading}
              className="w-full rounded border px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">All drivers</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user?.name || `Driver ${d.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilter('status', e.target.value)}
            disabled={loading}
            className="w-full rounded border px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </FilterPanel>

      {/* Results table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No fuel fillups found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => toggleSort('vehicle_name')}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  Vehicle {sortBy === 'vehicle_name' ? '↕' : ''}
                </th>
                <th
                  onClick={() => toggleSort('fillup_date')}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  Date {sortBy === 'fillup_date' ? '↕' : ''}
                </th>
                <th
                  onClick={() => toggleSort('gallons')}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  Gallons {sortBy === 'gallons' ? '↕' : ''}
                </th>
                <th
                  onClick={() => toggleSort('cost')}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  Cost {sortBy === 'cost' ? '↕' : ''}
                </th>
                <th
                  onClick={() => toggleSort('driver_name')}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  Driver {sortBy === 'driver_name' ? '↕' : ''}
                </th>
                <th
                  onClick={() => toggleSort('status')}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  Status {sortBy === 'status' ? '↕' : ''}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.vehicle?.name || item.vehicle?.license_plate || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.fillup_date || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.gallons || '-'} gal</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${item.cost || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.driver?.user?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.vehicle?.status || '-'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link to={`/fuel-fillups/${item.id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                    <Link to={`/fuel-fillups/${item.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, api.deleteFuelFillup)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && items.length > 0 && (
        <PaginationControls pagination={pagination} onPageChange={loadItems} loading={loading} />
      )}
    </div>
  );
}
