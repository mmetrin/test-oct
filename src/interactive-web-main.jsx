import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { InteractiveWebPage } from './pages/interactive-web'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InteractiveWebPage />
  </StrictMode>,
)
