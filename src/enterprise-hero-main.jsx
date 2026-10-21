import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/lib/installTypography'
import { EnterpriseHeroPage } from './pages/enterprise-hero/EnterpriseHeroPage'
import { preloadParallaxAssets } from './pages/enterprise-hero/preloadParallaxAssets'
import { DesignViewport } from './shared/ui/design-viewport'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
preloadParallaxAssets()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesignViewport><EnterpriseHeroPage /></DesignViewport>
  </StrictMode>,
)
