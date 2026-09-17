import React from 'react'
import { Box } from '@mui/material'
import { STATUS_COLOR } from '../../utils/constants.js'

export default function StatusBadge({ status, size = 'small', showDot = false }) {
  const info = STATUS_COLOR[status] || STATUS_COLOR.pending
  const isSmall = size === 'small'

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        px: isSmall ? 1.25 : 1.5,
        py: isSmall ? 0.25 : 0.4,
        borderRadius: '16px',
        backgroundColor: info.bg,
        border: info.border && info.border !== 'transparent' ? `1px solid ${info.border}` : 'none',
        color: info.color,
        fontWeight: 600,
        fontSize: isSmall ? '0.75rem' : '0.8125rem',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {showDot && (
        <Box
          sx={{
            width: isSmall ? 6 : 7,
            height: isSmall ? 6 : 7,
            borderRadius: '50%',
            backgroundColor: info.dot || info.color,
            flexShrink: 0,
          }}
        />
      )}
      <span>{info.label}</span>
    </Box>
  )
}
