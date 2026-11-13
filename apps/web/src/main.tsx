import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './design/fonts.css';
import './design/tokens.css';
import './design/base.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Elemento #root não encontrado no index.html');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
