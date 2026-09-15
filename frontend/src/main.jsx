import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { ThemeModeProvider } from './contexts/ThemeContext.jsx'
import App from './App.jsx'
import './index.css'

// ตั้งค่า Cookie เพื่อ Bypass หน้าคำเตือนของ ngrok Free อัตโนมัติสำหรับทุก Request
try {
  document.cookie = 'ngrok-skip-browser-warning=1; path=/; SameSite=Lax'
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
