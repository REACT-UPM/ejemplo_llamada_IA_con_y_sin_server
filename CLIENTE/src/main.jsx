import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FetchIASinServer from './FetchIASinServer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FetchIASinServer />
  </StrictMode>,
)
