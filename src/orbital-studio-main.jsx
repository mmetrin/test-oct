import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { OrbitalStudioPage } from './pages/orbital-studio/OrbitalStudioPage'

createRoot(document.getElementById('root')).render(
  <StrictMode><OrbitalStudioPage /></StrictMode>,
)
