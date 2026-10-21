import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AiAssistantPage } from './pages/ai-assistant'
import './index.css'
import './shared/lib/installTypography'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AiAssistantPage />
  </StrictMode>,
)
