import React from 'react'
import ReactDOM from 'react-dom/client'
import ClimbersDashboard from '../src/pages/climbersDashboard/ClimbersDashboard.tsx'
import '../src/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClimbersDashboard />
  </React.StrictMode>,
)
