// FILE: frontend/src/main.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: React application entry point — mounts App into DOM
//   SCOPE: StrictMode wrapper, createRoot rendering, CSS import
//   DEPENDS: M-APP
//   LINKS: M-MAIN_ENTRY
//   ROLE: ENTRY_POINT
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   bootstrap - mounts App component in StrictMode to #root (script entry, no exports)
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// START_BLOCK_BOOTSTRAP
createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)
// END_BLOCK_BOOTSTRAP