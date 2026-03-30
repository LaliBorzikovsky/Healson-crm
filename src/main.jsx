import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// אנחנו מייבאים את הרכיב של גוגל שהתקנו קודם
import { GoogleOAuthProvider } from '@react-oauth/google';

// אנחנו מושכים את ה-ID מה-env שלך
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* כאן אנחנו עוטפים את כל האפליקציה כדי שהיא תדע לעבוד עם גוגל */}
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)