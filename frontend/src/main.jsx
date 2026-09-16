import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1091235197752-ns00fvk5obg2ga9uttni2pntu1uol66i.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

