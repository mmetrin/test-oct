import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/lib/installTypography'
import { TargetedCallsPage } from './pages/targeted-calls/TargetedCallsPage'
import { DesignViewport } from './shared/ui/design-viewport'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesignViewport><TargetedCallsPage /></DesignViewport>
  </StrictMode>,
)
