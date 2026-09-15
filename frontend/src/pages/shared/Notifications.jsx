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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5">
            การแจ้งเตือนระบบ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ความเคลื่อนไหวล่าสุดของงานซ่อมและคำขอใหม่ในตำบล
          </Typography>
        </Box>
        <Button
          onClick={markAllRead}
          variant="outlined"
          size="small"
        >
          ทำเครื่องหมายอ่านทั้งหมด
        </Button>
      </Stack>

      <Box className="card">
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
                borderBottom: idx !== items.length - 1 ? '1px solid #f1f5f9' : 'none',
                backgroundColor: n.is_read ? 'transparent' : '#f8fafc',
                transition: 'background-color 0.15s ease',
                '&:hover': { backgroundColor: '#f1f5f9' },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: n.type === 'success' ? 'success.light' : '#f0f5fa',
                  color: n.type === 'success' ? '#15803d' : '#1b3752',
                  border: n.type === 'success' ? '1px solid #bbf7d0' : '1px solid #c3d7e9',
                }}
              >
                {n.type === 'success' ? <CheckCircleRoundedIcon /> : <InfoRoundedIcon />}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: n.is_read ? 600 : 700, color: '#0f172a' }}>
                  {n.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {n.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {dayjs(n.created_at).format('D MMM YYYY HH:mm น.')}
                </Typography>
              </Box>
              {!n.is_read && (
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: '#1b3752',
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
