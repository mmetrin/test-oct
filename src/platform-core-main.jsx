import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/lib/installTypography'
import { PlatformCorePage } from './pages/platform-core/PlatformCorePage'

createRoot(document.getElementById('root')).render(<StrictMode><PlatformCorePage /></StrictMode>)
