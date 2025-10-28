import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './popup/index.css'
import App from './popup/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
