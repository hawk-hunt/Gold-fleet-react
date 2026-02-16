import React from 'react';

/**
 * FleetImageCard
 * A simple box/card wrapper for a full‑width responsive image.
 *
 * Props:
 *   - src: string (required) image URL
 *   - alt: string (optional) alt text for accessibility
 *   - className: string (optional) additional classes for the outer container
 */
const FleetImageCard = ({ src, alt = '', className = '' }) => {
  return (
    <div
      className={`rounded-lg shadow-lg overflow-hidden flex-shrink-0 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover object-center"
      />
    </div>
  );
};

export default FleetImageCard;
