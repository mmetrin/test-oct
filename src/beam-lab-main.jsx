import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BeamLabPage } from './pages/beam-lab'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BeamLabPage />
  </StrictMode>,
)
