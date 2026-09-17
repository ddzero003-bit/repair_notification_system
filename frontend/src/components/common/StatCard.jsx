import React from 'react'
import { Box, Typography, Stack } from '@mui/material'

export default function StatCard({ label, value, icon, iconBg = '#eff6ff', iconColor = '#2563eb', iconBorder = '#dbeafe' }) {
  return (
    <Box
      className="card"
      sx={{
        p: 2.5,
        backgroundColor: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: '14px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography
          variant="body2"
          sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.8rem' }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            mt: 0.5,
            fontWeight: 800,
            color: '#0f172a',
            fontSize: '1.75rem',
            lineHeight: 1.2,
          }}
        >
          {value ?? 0}
        </Typography>
      </Box>

      {icon && (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: iconBg,
            border: `1px solid ${iconBorder}`,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
    </Box>
  )
}
