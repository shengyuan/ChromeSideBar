import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { i18n } from './i18n'
import './index.css'

// Load the saved UI language first so the page never flashes the wrong language
i18n.init().finally(() =>
{
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
