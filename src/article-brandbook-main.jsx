import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArticleBrandbookPage } from './pages/article-brandbook/ArticleBrandbookPage'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ArticleBrandbookPage />
  </StrictMode>,
)
