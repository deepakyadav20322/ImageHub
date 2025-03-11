import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import Navbar from './components/Navigation.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
    <Navbar/>
    <App />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
