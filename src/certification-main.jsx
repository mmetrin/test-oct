import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/lib/installTypography'
import { CertificationPage } from './pages/certification'
import { DesignViewport } from './shared/ui/design-viewport'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesignViewport><CertificationPage /></DesignViewport>
  </StrictMode>,
)
