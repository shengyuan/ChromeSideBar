import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpaceNavigatorApp } from './components/SpaceNavigatorApp';
import { i18n } from './i18n';
import './index.css';

// Load the saved UI language first so the popup never flashes the wrong language
i18n.init().finally(() =>
{
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <SpaceNavigatorApp />
    </React.StrictMode>,
  );
});
