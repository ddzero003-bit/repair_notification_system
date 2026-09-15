import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

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
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Brand Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#0f172a',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#1b3752',
                lineHeight: 1.2,
              }}
            >
              เทศบาลตำบลสงเปลือย
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                display: 'block',
                mt: 0.5,
              }}
            >
              ระบบแจ้งซ่อมสาธารณูปโภค (สำหรับเจ้าหน้าที่)
            </Typography>
          </Link>
        </Box>

        {/* Card Content */}
        <Box
          className="card"
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        >
          <Outlet />
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link
            to="/"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.85rem',
            }}
          >
            ← กลับสู่หน้าหลัก
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
