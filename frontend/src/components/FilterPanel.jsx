import React from 'react';

/**
 * Reusable FilterPanel component
 * Renders a flexible filter UI for list pages
 * 
 * Props:
 *   - filters: object with filter state values
 *   - onFilterChange: callback (key, value) when filter changes
 *   - onReset: callback when reset button clicked
 *   // search functionality removed; panel no longer renders the search input
 *   - loading: boolean, disable inputs if true
 *   - children: additional filter fields (render props style)
 *   - showExport: boolean, show export buttons
 *   - onExport: callback (format) when export button clicked
 */
export default function FilterPanel({
  filters = {},
  onFilterChange = () => {},
  onReset = () => {},
  // onSearch and searchValue removed
  loading = false,
  children,
  showExport = false,
  onExport = () => {},
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">

      {/* Custom filter fields */}
      {children}

      {/* Date range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => onFilterChange('start_date', e.target.value)}
            disabled={loading}
            className="w-full rounded border px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => onFilterChange('end_date', e.target.value)}
            disabled={loading}
            className="w-full rounded border px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Per page and actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-end justify-between">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Per page</label>
          <select
            value={filters.per_page || 10}
            onChange={(e) => onFilterChange('per_page', parseInt(e.target.value, 10))}
            disabled={loading}
            className="w-full rounded border px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onReset}
            disabled={loading}
            className="flex-1 sm:flex-none px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>
          {showExport && (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => onExport('csv')}
                disabled={loading}
                className="px-3 py-2 bg-gray-100 rounded text-sm text-xs hover:bg-gray-200 disabled:opacity-50"
              >
                CSV
              </button>
              <button
                onClick={() => onExport('xls')}
                disabled={loading}
                className="px-3 py-2 bg-gray-100 rounded text-sm text-xs hover:bg-gray-200 disabled:opacity-50"
              >
                Excel
              </button>
              <button
                onClick={() => onExport('pdf')}
                disabled={loading}
                className="px-3 py-2 bg-gray-100 rounded text-sm text-xs hover:bg-gray-200 disabled:opacity-50"
              >
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile export buttons */}
      {showExport && (
        <div className="sm:hidden flex gap-2">
          <button
            onClick={() => onExport('csv')}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport('xls')}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            Export XLS
          </button>
          <button
            onClick={() => onExport('pdf')}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
}
