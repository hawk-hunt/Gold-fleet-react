import { useLocation, Link } from 'react-router-dom';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const navigationSections = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Map Dashboard', path: '/dashboard/map' },
        { label: 'Information Dashboard', path: '/dashboard/info' },
      ],
    },
    {
      title: 'Fleet Management',
      items: [
        { label: 'Vehicles', path: '/vehicles' },
        { label: 'Drivers', path: '/drivers' },
        { label: 'Trips', path: '/trips' },
      ],
    },
    {
      title: 'Maintenance',
      items: [
        { label: 'Services', path: '/services' },
        { label: 'Inspections', path: '/inspections' },
        { label: 'Issues', path: '/issues' },
      ],
    },
    {
      title: 'Financial',
      items: [
        { label: 'Expenses', path: '/expenses' },
        { label: 'Fuel Fill-ups', path: '/fuel-fillups' },
      ],
    },
    {
      title: 'Planning',
      items: [
        { label: 'Reminders', path: '/reminders' },
      ],
    },
  ];

  const getIcon = (label) => {
    const iconProps = 'w-5 h-5';
    const viewBox = '0 0 20 20';

    const icons = {
      'Map Dashboard': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>,
      'Information Dashboard': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>,
      'Vehicles': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" /></svg>,
      'Drivers': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
      'Trips': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>,
      'Services': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
      'Inspections': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
      'Issues': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
      'Expenses': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" /></svg>,
      'Fuel Fill-ups': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>,
      'Reminders': <svg className={iconProps} fill="currentColor" viewBox={viewBox}><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
    };

    return icons[label] || null;
  };

  return (
    <aside
      className={`absolute inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-gray-900 text-white lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
      }`}
    >
      <div className="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
        <span className="text-xl font-bold tracking-wider text-yellow-500">Gold Fleet</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navigationSections.map((section, idx) => (
            <li key={idx}>
              <span className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                {section.title}
              </span>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 hover:bg-gray-800 transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-800 border-l-4 border-yellow-500'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  {getIcon(item.label)}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
