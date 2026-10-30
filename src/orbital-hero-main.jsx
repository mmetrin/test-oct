import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/lib/installTypography'
import { OrbitalHeroPage } from './pages/orbital-hero/OrbitalHeroPage'
import { DesignViewport } from './shared/ui/design-viewport'

createRoot(document.getElementById('root')).render(
  <StrictMode><DesignViewport><OrbitalHeroPage /></DesignViewport></StrictMode>,
)
