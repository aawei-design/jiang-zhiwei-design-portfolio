import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MasonryCloneApp from './MasonryCloneApp.jsx'
import './styles.css'
import './masonry-page.css'

document.body.classList.add('masonry-effects-version')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MasonryCloneApp />
  </StrictMode>,
)
