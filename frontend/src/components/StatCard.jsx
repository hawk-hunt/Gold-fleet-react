import React from 'react';

/**
 * Generic statistic card used across dashboards.
 * Props:
 *   icon - React node for the leading icon
 *   title - string heading
 *   value - primary value display (number or string)
 *   description - small text below value
 *   children - optional extra content (e.g. details toggle)
 *   onClick - callback when card is clicked (makes card interactive)
 */
const StatCard = ({ icon, title, value, description, children, onClick }) => {
  const clickable = typeof onClick === 'function';
  return (
    <div
      onClick={onClick}
      className={
        `bg-white rounded-lg shadow p-6 flex flex-col justify-between transition-shadow ` +
        (clickable ? 'cursor-pointer hover:shadow-lg' : '')
      }
    >
      <div className="flex items-start space-x-4">
        {icon && <div className="text-3xl text-yellow-600 flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default StatCard;
