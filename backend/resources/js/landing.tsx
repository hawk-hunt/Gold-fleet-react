import React from 'react';
import { createRoot } from 'react-dom/client';
import LandingPage from './components/LandingPage';

// Initialize React app with LandingPage component
const container = document.getElementById('landing-page-root');
if (container) {
    const root = createRoot(container);
    root.render(<LandingPage />);
} else {
    console.error('Landing page root element not found');
}