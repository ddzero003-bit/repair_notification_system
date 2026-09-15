import React from 'react'
import { Box, Typography, Stack } from '@mui/material'

export default function StatCard({ label, value, subtext, trend, accent = '#1b3752', icon }) {
  return (
    <Box
      className="card"
      sx={{
        p: 2.5,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#475569', fontWeight: 500, fontSize: '0.85rem' }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              mt: 0.75,
              fontWeight: 700,
              color: '#0f172a',
              fontSize: '1.75rem',
            }}
          >
            {value}
          </Typography>
        </Box>
        {icon && (
          <Box sx={{ color: '#64748b', pt: 0.25 }}>
            {icon}
          </Box>
        )}
      </Stack>

      {(subtext || trend) && (
        <Box sx={{ mt: 1.5, pt: 1.25, borderTop: '1px solid #f1f5f9' }}>
          {trend ? (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: trend.startsWith('-') ? '#b91c1c' : '#15803d',
              }}
            >
              {trend}
            </Typography>
          ) : (
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {subtext}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}
