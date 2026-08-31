import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PrivyApp from './providers/PrivyApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PrivyApp>
        <App />
      </PrivyApp>
    </BrowserRouter>
  </StrictMode>,
)
