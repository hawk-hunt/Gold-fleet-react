import React from 'react';

/**
 * Reusable PaginationControls component
 * Displays pagination info and nav buttons
 * 
 * Props:
 *   - pagination: { current_page, last_page, total }
 *   - onPageChange: callback (page) when page button clicked
 *   - loading: boolean, disable buttons if true
 */
export default function PaginationControls({
  pagination = { current_page: 1, last_page: 1, total: 0 },
  onPageChange = () => {},
  loading = false,
}) {
  const { current_page = 1, last_page = 1, total = 0 } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{current_page}</span> of{' '}
        <span className="font-semibold">{last_page}</span> — Total:{' '}
        <span className="font-semibold">{total}</span> records
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={loading || current_page === 1}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, current_page - 1))}
          disabled={loading || current_page === 1}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(Math.min(last_page, current_page + 1))}
          disabled={loading || current_page === last_page}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(last_page)}
          disabled={loading || current_page === last_page}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
}
