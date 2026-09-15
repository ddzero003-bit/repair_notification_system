import React from 'react'
import { Box, Typography, Button } from '@mui/material'

export default function EmptyState({
  title = 'ไม่พบข้อมูล',
  description = 'ไม่มีรายการในระบบขณะนี้',
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon && <Box sx={{ color: '#94a3b8', mb: 1.5 }}>{icon}</Box>}

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: '#334155',
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#64748b',
          maxWidth: 380,
          mb: actionLabel ? 2 : 0,
        }}
      >
        {description}
      </Typography>

      {actionLabel && (
        <Button
          variant="outlined"
          size="small"
          onClick={onAction}
          sx={{ mt: 1.5 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
