import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { CateogaryProvider } from './components/context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CateogaryProvider>

      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CateogaryProvider>

  </StrictMode>
)