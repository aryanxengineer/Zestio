import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext.tsx';

export const authService = 'http://localhost:5000';
export const restaurantService = 'http://localhost:5001';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="468838161863-9mk978kcvpqvv7e1rg6277jtt7239ses.apps.googleusercontent.com">
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
