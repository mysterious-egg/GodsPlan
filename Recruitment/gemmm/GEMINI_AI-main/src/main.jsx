// index.js (or main entry file)

// Import the necessary modules
import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import for React 18
import App from './App'; // Your main App component

// Get the root element
const container = document.getElementById('root');

// Create the root
const root = createRoot(container);

// Render your app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);