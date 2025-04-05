import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, useLocation } from 'react-router'
import Navbar from './components/Navigation.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'




const RootLayout = () => {
  const location = useLocation()

  // Hide Navbar on dashboard-related routes
  const hideNavbarOnRoutes = ['/dashboard', '/welcome'].some(path => 
    location.pathname.startsWith(path)
  )

  return (
    <>
      {!hideNavbarOnRoutes && <Navbar />}
      <App />
    </>
  )
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
    {/* <Navbar/>
    <App /> */}
    <RootLayout/>
    </BrowserRouter>
    </ThemeProvider>
    </PersistGate>
    <Toaster/>
    </Provider>
  </StrictMode>,
)
