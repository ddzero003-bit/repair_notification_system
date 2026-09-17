import React from 'react'
import { Box, Typography, Stack, Button, Avatar } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import dayjs from 'dayjs'
import { useNotifications } from '../../contexts/NotificationContext.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

export default function Notifications() {
  const { items, markAllRead, markRead } = useNotifications()

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.35rem' }}>
            การแจ้งเตือน
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            ความเคลื่อนไหวล่าสุดของงานแจ้งซ่อม
          </Typography>
        </Box>
        <Button
          onClick={markAllRead}
          variant="outlined"
          size="small"
          sx={{
            borderColor: '#bfdbfe',
            color: '#2563eb',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.8rem',
            px: 1.5,
            py: 0.5,
            backgroundColor: '#ffffff',
            '&:hover': { borderColor: '#93c5fd', backgroundColor: '#eff6ff' },
          }}
        >
          อ่านทั้งหมด
        </Button>
      </Stack>

      <Box
        className="card"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
        }}
      >
        {items.length === 0 ? (
          <EmptyState
            icon={<NotificationsRoundedIcon sx={{ fontSize: 36, color: '#94a3b8' }} />}
            title="ไม่มีการแจ้งเตือนใหม่"
            description="เมื่อมีความเคลื่อนไหวหรือมีคำขอแจ้งซ่อมใหม่ ระบบจะแจ้งเตือนที่นี่ทันที"
          />
        ) : (
          items.map((n, idx) => (
            <Box
              key={n.id}
              onClick={() => markRead(n.id)}
              sx={{
                display: 'flex',
                gap: 2,
                p: 2.5,
                cursor: 'pointer',
                borderBottom: idx !== items.length - 1 ? '1px solid #f8fafc' : 'none',
                backgroundColor: n.is_read ? '#ffffff' : '#f8fafc',
                transition: 'background-color 0.15s ease',
                '&:hover': { backgroundColor: '#f1f5f9' },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: n.type === 'success' ? '#f0fdf4' : '#eff6ff',
                  color: n.type === 'success' ? '#16a34a' : '#2563eb',
                  width: 38,
                  height: 38,
                  border: n.type === 'success' ? '1px solid #dcfce7' : '1px solid #dbeafe',
                }}
              >
                {n.type === 'success' ? (
                  <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <InfoRoundedIcon sx={{ fontSize: 20 }} />
                )}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: n.is_read ? 600 : 700, color: '#0f172a', fontSize: '0.9rem' }}>
                  {n.title}
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.825rem', mt: 0.25 }}>
                  {n.message}
                </Typography>
                <Typography variant="caption" color="#94a3b8" sx={{ display: 'block', mt: 0.5, fontSize: '0.725rem' }}>
                  {dayjs(n.created_at).format('D MMM YYYY HH:mm')}
                </Typography>
              </Box>
              {!n.is_read && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    mt: 1,
                  }}
                />
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
