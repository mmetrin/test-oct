import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { EcosystemBuilderPage } from './pages/ecosystem-builder/EcosystemBuilderPage'

createRoot(document.getElementById('root')).render(
  <StrictMode><EcosystemBuilderPage /></StrictMode>,
)
