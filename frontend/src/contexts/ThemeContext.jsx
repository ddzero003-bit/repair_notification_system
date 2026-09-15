import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getTheme } from '../theme/theme.js'

const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
})

export function useThemeMode() {
  return useContext(ThemeContext)
}

export function ThemeModeProvider({ children }) {
  // โหลดค่าจาก localStorage เพื่อจำการตั้งค่าระหว่างเซสชัน
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('darkMode') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('darkMode', String(darkMode))
    } catch {}
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const theme = getTheme(darkMode ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
