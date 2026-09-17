import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar
} from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import { useAuth } from '../../contexts/AuthContext.jsx'

const drawerWidth = 240

export default function Sidebar({ menu, mobileOpen, onClose }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const roleText =
    user?.role === 'operator'
      ? 'หัวหน้าช่าง'
      : user?.role === 'technician'
      ? 'ช่างประจำการ'
      : 'ประชาชน'

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', color: 'text.primary' }}>
      {/* Brand Header */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}
        >
          <BuildRoundedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#0f172a',
              lineHeight: 1.2,
            }}
          >
            ระบบแจ้งซ่อม
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              display: 'block',
              mt: 0.2,
              fontSize: '0.75rem',
            }}
          >
            สาธารณูปโภค LINE OA
          </Typography>
        </Box>
      </Box>

      {/* Nav List with pill active style */}
      <List sx={{ flex: 1, py: 1.5, pr: 1.5, pl: 0 }}>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onClose}
            sx={{
              borderRadius: '0 24px 24px 0',
              mb: 0.75,
              py: 1,
              pl: 2.5,
              pr: 2,
              color: '#475569',
              transition: 'all 0.15s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                '& .MuiListItemIcon-root': {
                  color: '#2563eb',
                },
              },
              '&.active': {
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontWeight: 700,
                '& .MuiListItemIcon-root': {
                  color: '#2563eb',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 700,
                  color: '#2563eb',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#64748b' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* User Info & Logout (Subtle footer) */}
      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Avatar
            src={user?.avatar_url || ''}
            sx={{
              width: 34,
              height: 34,
              bgcolor: '#2563eb',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {!user?.avatar_url && (user?.name?.[0] || 'U')}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 600, fontSize: '0.825rem', color: '#0f172a' }}>
              {user?.name || 'ผู้ใช้งาน'}
            </Typography>
            <Typography variant="caption" color="#64748b" sx={{ display: 'block', fontSize: '0.725rem' }}>
              {roleText}
            </Typography>
          </Box>
          <Box
            component="button"
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
            title="ออกจากระบบ"
            sx={{
              background: 'none',
              border: 'none',
              p: 0.5,
              cursor: 'pointer',
              color: '#94a3b8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': { color: '#ef4444', backgroundColor: '#fef2f2' },
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #f1f5f9',
          },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: '1px solid #f1f5f9',
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
          },
        }}
        open
      >
        {content}
      </Drawer>
    </>
  )
}

export { drawerWidth }
