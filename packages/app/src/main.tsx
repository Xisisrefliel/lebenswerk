import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { initRegistries } from './initRegistries.js';
import './i18n/index.js';
import './styles/tailwind.css';
import './styles/print.css';

initRegistries();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element in index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
