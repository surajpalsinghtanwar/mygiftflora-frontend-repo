// src/main.tsx
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { routes } from './routes';

import App from './App';
import './index.css';

import type { RootState } from './store';
import rootReducer from './store/rootReducer';

// Ensure global.d.ts exists and declares window.__PRELOADED_STATE__
// import './global.d';

// Grab the preloaded state from the server injected script tag
// Check for potential typo here again if needed
const preloadedState = window.__PRELOADED_STATE__ as RootState;

// IMPORTANT: Delete the global variable immediately after reading it
// Check for potential typo here again if needed
delete window.__PRELOADED_STATE__;

// Create the Redux store, initializing it with the preloaded state from the server.
const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
});

// Create a data router instance using createBrowserRouter
const router = createBrowserRouter(routes);


// Use hydrateRoot instead of createRoot
ReactDOMClient.hydrateRoot(
  document.getElementById('root')!,
  // Try with and without StrictMode if the issue persists
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>,
);