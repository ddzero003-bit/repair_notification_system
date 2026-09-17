import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        p: 2.5,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {/* Brand Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <BuildRoundedIcon sx={{ color: '#ffffff', fontSize: 22 }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#0f172a',
              lineHeight: 1.2,
            }}
          >
            ระบบแจ้งซ่อมสาธารณูปโภค
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              display: 'block',
              mt: 0.5,
              fontSize: '0.8rem',
            }}
          >
            ผ่าน LINE Official Account
          </Typography>
        </Box>

        {/* Card Content */}
        <Box
          className="card"
          sx={{
            p: { xs: 3, sm: 4.5 },
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
