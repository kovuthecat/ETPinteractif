import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/global.css'
import PatientApp from './PatientApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PatientApp />
  </StrictMode>,
)
