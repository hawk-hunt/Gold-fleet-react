import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Generic list page for CRUD-style resources. Usage:
 *
 * <ListPage
 *    title="Vehicles"
 *    fetchData={() => api.getVehicles().then(r => r.data)}
 *    deleteItem={id => api.deleteVehicle(id)}
 *    createUrl="/vehicles/create"
 *    viewUrl={id => `/vehicles/${id}`}
 *    editUrl={id => `/vehicles/${id}/edit`}
 *    columns={[
 *      { label: 'License', key: 'license_plate' },
 *      { label: 'Make/Model', transform: v => v.make + ' ' + v.model },
 *      ...
 *    ]}
 * />
 *
 * The component handles loading/error states, deletion confirmation and
 * renders a responsive table with modern Tailwind styling.
 */

const ListPage = ({
  title,
  fetchData,
  deleteItem,
  createUrl,
  viewUrl,
  editUrl,
  columns = [],
  keyField = 'id',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchData();
      setItems(data || []);
    } catch (err) {
      setError(`Failed to load ${title.toLowerCase()}: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setItems(items.filter(i => i[keyField] !== id));
      } catch (err) {
        setError(`Failed to delete ${title.toLowerCase()}: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {createUrl && (
          <Link
            to={createUrl}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            + New {title.slice(0, -1)}
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Loading {title.toLowerCase()}...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No {title.toLowerCase()} found. Create one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item[keyField]} className="hover:bg-gray-50">
                  {columns.map((col, idx) => {
                    const value = col.transform
                      ? col.transform(item)
                      : item[col.key];
                    return (
                      <td
                        key={idx}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        {value ?? '-'}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-sm space-x-2">
                    {viewUrl && (
                      <Link
                        to={viewUrl(item[keyField])}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    )}
                    {editUrl && (
                      <Link
                        to={editUrl(item[keyField])}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Edit
                      </Link>
                    )}
                    {deleteItem && (
                      <button
                        onClick={() => handleDelete(item[keyField])}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListPage;
