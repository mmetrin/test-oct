import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { CursorGridPage } from './pages/cursor-grid'
import './index.css'
import './shared/lib/installTypography'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CursorGridPage />
  </StrictMode>,
)
