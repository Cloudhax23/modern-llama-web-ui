import React from 'react';
import ReactDOM from 'react-dom/client';
import HiveUIApp from './components/HiveUIApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HiveUIApp />
  </React.StrictMode>
);
