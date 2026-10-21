import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './shared/lib/installTypography'
import { DcpPage } from './pages/dcp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DcpPage />
  </StrictMode>,
)
