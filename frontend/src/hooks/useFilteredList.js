import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing filterable list state
 * Handles:
 *   - Filter state initialization from URL query params
 *   - Persisting filters to URL
 *   - Debounced search
 *   - Pagination
 *   - Sorting
 * 
 * Usage:
 *   const {
 *     items, loading, error, pagination,
 *     filters, setFilter, resetFilters,
 *     searchTerm, setSearchTerm,
 *     sortBy, setSortBy, sortDir, toggleSort,
 *     loadItems, handleExport, handleDelete
 *   } = useFilteredList(apiMethod, exportApiMethod, defaultParams);
 */
export function useFilteredList(
  fetchFn,          // API call function(params)
  exportFn = null,  // API export function(params, format) - optional
  defaultParams = {} // Additional default filters
) {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // Initialize filters from URL
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  // searchTerm removed; we no longer track a free‑text search field
  const [filters, setFiltersState] = useState({
    vehicle_id: query.get('vehicle_id') || '',
    driver_id: query.get('driver_id') || '',
    status: query.get('status') || '',
    start_date: query.get('start_date') || '',
    end_date: query.get('end_date') || '',
    per_page: parseInt(query.get('per_page') || '10', 10),
    sort_by: query.get('sort_by') || defaultParams.sort_by || 'created_at',
    sort_dir: query.get('sort_dir') || defaultParams.sort_dir || 'desc',
    ...defaultParams,
  });

  const [sortBy, setSortBy] = useState(filters.sort_by);
  const [sortDir, setSortDir] = useState(filters.sort_dir);

  // Build params object
  const params = useMemo(
    () => ({
      ...filters,
      sort_by: sortBy,
      sort_dir: sortDir,
    }),
    [filters, sortBy, sortDir]
  );

  // Update URL with current params
  const applyQueryParams = useCallback(
    (page = 1) => {
      const qp = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) qp.set(key, String(filters[key]));
      });
      if (sortBy) qp.set('sort_by', sortBy);
      if (sortDir) qp.set('sort_dir', sortDir);
      if (page > 1) qp.set('page', String(page));

      const qs = qp.toString();
      navigate({ search: qs }, { replace: true });
    },
    [filters, sortBy, sortDir, navigate]
  );


  // Load items
  const loadItems = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchFn({ ...params, page });
        const payload = res.data || res;
        setItems(payload.data || payload);
        setPagination({
          current_page: payload.current_page || payload.currentPage || 1,
          last_page: payload.last_page || payload.lastPage || 1,
          total: payload.total || 0,
        });
      } catch (err) {
        setError('Failed to load data: ' + (err.message || err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, params]
  );

  // Initial load
  useEffect(() => {
    loadItems(query.get('page') || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setters
  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
    setLoading(true);
    // Auto-reload after filter changes (short debounce)
    setTimeout(() => loadItems(1), 100);
  }, [loadItems]);

  const resetFilters = useCallback(() => {
    // searchTerm no longer tracked
    setFiltersState({
      vehicle_id: '',
      driver_id: '',
      status: '',
      start_date: '',
      end_date: '',
      per_page: 10,
      sort_by: defaultParams.sort_by || 'created_at',
      sort_dir: defaultParams.sort_dir || 'desc',
      ...defaultParams,
    });
    setSortBy(defaultParams.sort_by || 'created_at');
    setSortDir(defaultParams.sort_dir || 'desc');
    applyQueryParams(1);
    setTimeout(() => loadItems(1), 100);
  }, [applyQueryParams, defaultParams, loadItems]);

  const toggleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortDir('asc');
      }
      applyQueryParams(1);
      setTimeout(() => loadItems(1), 100);
    },
    [sortBy, sortDir, applyQueryParams, loadItems]
  );

  const handleExport = useCallback(
    async (format) => {
      if (!exportFn) {
        setError('Export not supported for this resource');
        return;
      }
      try {
        setLoading(true);
        const blob = await exportFn(params, format);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export_${Date.now()}.${format === 'xls' ? 'csv' : format === 'pdf' ? 'html' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (e) {
        setError('Export failed: ' + (e.message || e));
      } finally {
        setLoading(false);
      }
    },
    [exportFn, params]
  );

  const handleDelete = useCallback(
    async (id, deleteFn) => {
      if (!window.confirm('Are you sure?')) return;
      try {
        await deleteFn(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (e) {
        setError('Delete failed: ' + (e.message || e));
      }
    },
    []
  );

  return {
    // State
    items,
    loading,
    error,
    pagination,
    // Filters
    filters,
    setFilter,
    resetFilters,
    // Sorting
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    toggleSort,
    // Actions
    loadItems,
    handleExport,
    handleDelete,
    // Params (for export, etc.)
    params,
  };
}
