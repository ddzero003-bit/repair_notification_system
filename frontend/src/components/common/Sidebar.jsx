import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Avatar
} from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useAuth } from '../../contexts/AuthContext.jsx'

const drawerWidth = 250

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'background.paper', color: 'text.primary' }}>
      {/* Brand Header */}
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            color: (theme) => theme.palette.mode === 'dark' ? '#38bdf8' : '#1b3752',
            lineHeight: 1.2,
          }}
        >
          ระบบแจ้งซ่อมสาธารณูปโภค
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            mt: 0.25,
            fontSize: '0.75rem',
          }}
        >
          เทศบาลตำบลสงเปลือย
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* Nav List */}
      <List sx={{ flex: 1, px: 1.5, py: 1.5 }}>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onClose}
            sx={{
              borderRadius: '6px',
              mb: 0.5,
              py: 0.9,
              px: 1.5,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f8fafc',
                color: 'text.primary',
              },
              '&.active': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.15)' : '#f1f5f9',
                color: (theme) => theme.palette.mode === 'dark' ? '#38bdf8' : '#1b3752',
                fontWeight: 700,
                '& .MuiListItemIcon-root': {
                  color: (theme) => theme.palette.mode === 'dark' ? '#38bdf8' : '#1b3752',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 700,
                  color: (theme) => theme.palette.mode === 'dark' ? '#38bdf8' : '#1b3752',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* User Info & Logout */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user?.avatar_url || ''}
            sx={{
              width: 36,
              height: 36,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0284c7' : '#1b3752',
              fontSize: 14,
              fontWeight: 700
            }}
          >
            {!user?.avatar_url && (user?.name?.[0] || 'U')}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary' }}>
              {user?.name || 'ผู้ใช้งาน'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {roleText}
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          sx={{
            borderRadius: '6px',
            color: '#ef4444',
            py: 0.75,
            px: 1.5,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
            },
          }}
          onClick={async () => {
            await logout()
            navigate('/login')
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: '#ef4444' }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="ออกจากระบบ"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: '0.8125rem',
            }}
          />
        </ListItemButton>
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
            backgroundColor: 'background.paper',
            borderColor: 'divider',
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
            borderRight: '1px solid',
            borderColor: 'divider',
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
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
