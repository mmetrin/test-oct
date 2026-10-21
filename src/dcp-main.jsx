import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { DcpPage } from './pages/dcp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DcpPage />
  </StrictMode>,
)
