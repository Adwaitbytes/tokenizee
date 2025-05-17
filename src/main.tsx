
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Use createRoot API for better performance with React 18
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

// Add this performance optimization for React
if ('requestIdleCallback' in window) {
  // Use requestIdleCallback to render when browser is idle
  window.requestIdleCallback(() => {
    // Disable StrictMode in production for better performance
    // This removes the double-rendering in production
    const app = import.meta.env.DEV ? (
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    root.render(app);
  });
} else {
  // Fallback for browsers that don't support requestIdleCallback
  const app = import.meta.env.DEV ? (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  ) : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  root.render(app);
}
