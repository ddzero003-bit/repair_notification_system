import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { REPAIR_STATUSES } from '../../utils/constants.js'

export default function RepairTimeline({ status }) {
  const steps = REPAIR_STATUSES.filter((s) => !['cancelled', 'rejected'].includes(s.value))
  const currentIndex = steps.findIndex((s) => s.value === status)

  return (
    <Stack sx={{ py: 0.5 }}>
      {/* Rejected notice */}
      {status === 'rejected' && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
          }}
        >
          <Typography fontWeight={600} fontSize="0.875rem" color="#b91c1c">
            ช่างปฏิเสธงานซ่อม — รอหัวหน้าช่างมอบหมายใหม่
          </Typography>
        </Box>
      )}

      {/* Cancelled notice */}
      {status === 'cancelled' && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
          }}
        >
          <Typography fontWeight={600} fontSize="0.875rem" color="#b91c1c">
            คำขอนี้ถูกยกเลิกแล้ว
          </Typography>
        </Box>
      )}

      {steps.map((step, idx) => {
        const effectiveIndex =
          status === 'rejected'
            ? steps.findIndex((s) => s.value === 'assigned')
            : currentIndex

        const isDone = idx <= effectiveIndex
        const isCurrent = idx === effectiveIndex
        const isLast = idx === steps.length - 1

        return (
          <Box key={step.value} sx={{ display: 'flex', gap: 1.75 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: isDone ? '#10b981' : '#ffffff',
                  border: isDone ? 'none' : '2px solid #cbd5e1',
                  mt: 0.35,
                  boxShadow: isCurrent ? '0 0 0 3px #e1ebf4' : 'none',
                }}
              />
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    minHeight: 28,
                    backgroundColor: isDone && idx < effectiveIndex ? '#10b981' : '#e2e8f0',
                    my: 0.5,
                  }}
                />
              )}
            </Box>

            <Box sx={{ pb: isLast ? 0 : 2 }}>
              <Typography
                sx={{
                  fontWeight: isDone ? 600 : 400,
                  color: isCurrent ? '#0f172a' : isDone ? '#334155' : '#94a3b8',
                  fontSize: '0.875rem',
                }}
              >
                {step.label}
              </Typography>
              {isCurrent && (
                <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 600 }}>
                  สถานะปัจจุบัน
                </Typography>
              )}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}
