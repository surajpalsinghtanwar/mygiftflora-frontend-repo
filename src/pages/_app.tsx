import React from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

// Import Bootstrap JS for client-side components
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Import Bootstrap JS on client-side only
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </Provider>
  );
}