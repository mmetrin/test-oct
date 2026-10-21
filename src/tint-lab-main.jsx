import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { TintLabPage } from './pages/tint-lab'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TintLabPage />
  </StrictMode>,
)
