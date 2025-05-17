
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Create a function to initialize the app with performance optimizations
const initApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
};

// Use requestIdleCallback to initialize the app when the browser is idle
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(() => {
    initApp();
  });
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(initApp, 1);
}
