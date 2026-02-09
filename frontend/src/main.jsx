import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/css/app.css'
import App from './App.jsx'

// Development utility: Clear auth state
window.clearAuth = () => {
  sessionStorage.removeItem('auth_token')
  sessionStorage.clear()
  console.log('[Dev] Auth state cleared. Reload page to see effect.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
