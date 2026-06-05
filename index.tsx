/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { AdminApp } from './admin/AdminApp';
import { ContentProvider } from './context/ContentContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
