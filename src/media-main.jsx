import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/lib/installTypography'
import { MediaPage } from './pages/media'
import { DesignViewport } from './shared/ui/design-viewport'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesignViewport><MediaPage /></DesignViewport>
  </StrictMode>,
)
