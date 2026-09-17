import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, IconButton, Box, Typography, Badge, Avatar, Menu, MenuItem, Divider,
} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

export default function DashboardNavbar({ onMenuClick, roleLabel }) {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        backgroundColor: '#ffffff',
        color: 'text.primary',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: 56, px: { xs: 2, md: 3 } }}>
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { md: 'none' },
            color: 'text.primary',
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        {/* Title */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#64748b',
            }}
          >
            {roleLabel}
          </Typography>
        </Box>

        {/* Notification Bell */}
        <IconButton
          onClick={() => navigate('notifications')}
          sx={{
            color: '#64748b',
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneRoundedIcon fontSize="small" />
          </Badge>
        </IconButton>

        {/* User Profile Avatar */}
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ p: 0.5 }}
        >
          <Avatar
            src={user?.avatar_url || ''}
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#2563eb',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {!user?.avatar_url && (user?.name?.[0] || 'U')}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              color: 'text.primary',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minWidth: 180,
              mt: 1,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user?.username}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'divider' }} />
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              navigate('profile')
            }}
            sx={{ py: 1, fontSize: '0.875rem' }}
          >
            ข้อมูลส่วนตัว
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              navigate('settings')
            }}
            sx={{ py: 1, fontSize: '0.875rem' }}
          >
            ตั้งค่า
          </MenuItem>
          <Divider sx={{ borderColor: 'divider' }} />
          <MenuItem
            sx={{ color: '#ef4444', fontWeight: 600, py: 1, fontSize: '0.875rem' }}
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
          >
            ออกจากระบบ
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
