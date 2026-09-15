import { createTheme } from '@mui/material/styles'

/**
 * Clean Official Government Theme — เทศบาลตำบลสงเปลือย
 * รองรับทั้งโหมดสว่าง (Light Mode) และโหมดมืด (Dark Mode)
 */
export const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#38bdf8' : '#1b3752',
        light: isDark ? '#7dd3fc' : '#2c6494',
        dark: isDark ? '#0284c7' : '#112234',
        contrastText: isDark ? '#0f172a' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#94a3b8' : '#475569',
        light: isDark ? '#cbd5e1' : '#64748b',
        dark: isDark ? '#64748b' : '#334155',
        contrastText: '#ffffff',
      },
      info: {
        main: '#0284c7',
        light: isDark ? '#082f49' : '#e0f2fe',
        dark: '#0369a1',
        contrastText: '#ffffff',
      },
      success: {
        main: '#16a34a',
        light: isDark ? '#052e16' : '#f0fdf4',
        dark: '#15803d',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#d97706',
        light: isDark ? '#451a03' : '#fffbeb',
        dark: '#b45309',
        contrastText: '#ffffff',
      },
      error: {
        main: '#dc2626',
        light: isDark ? '#450a0a' : '#fef2f2',
        dark: '#b91c1c',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#475569',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"IBM Plex Sans Thai", "Sarabun", system-ui, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.01em' },
      h2: { fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontWeight: 700, fontSize: '1.5rem' },
      h5: { fontWeight: 700, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      body1: { fontSize: '0.925rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: {
            backgroundColor: isDark ? '#0284c7' : '#1b3752',
            color: '#ffffff',
            '&:hover': { backgroundColor: isDark ? '#0369a1' : '#112234' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 6 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
    },
  })
}
