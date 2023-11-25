import React from 'react';
import ReactDOM from 'react-dom/client';
import ModernLLAMAWebUIApp from './components/modern-llama-web-ui-app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ModernLLAMAWebUIApp />
  </React.StrictMode>
);
