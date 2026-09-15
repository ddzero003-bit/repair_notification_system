import React from 'react'
import {
  Box, Typography, Stack, Switch, FormControlLabel,
  MenuItem, TextField, Divider, Alert,
} from '@mui/material'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useThemeMode } from '../../contexts/ThemeContext.jsx'

export default function Settings() {
  const { darkMode, toggleDarkMode } = useThemeMode()

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        ตั้งค่าระบบ
      </Typography>

      <Box className="card" sx={{ p: 3.5, maxWidth: 560 }}>
        {/* ── ภาษาและการแสดงผล ── */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          ภาษาและการแสดงผล
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            select
            label="ภาษาหลักของระบบ"
            defaultValue="th"
            size="small"
          >
            <MenuItem value="th">ภาษาไทย (Thai)</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </TextField>

          {/* Dark Mode Toggle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: '10px',
              border: '1px solid',
              borderColor: darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
              transition: 'all 0.3s ease',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                  transition: 'background-color 0.3s',
                }}
              >
                {darkMode
                  ? <DarkModeRoundedIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                  : <LightModeRoundedIcon sx={{ fontSize: 20, color: '#f59e0b' }} />
                }
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  โหมดมืด (Dark Mode)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {darkMode ? 'เปิดอยู่ — ใช้สีเข้ม' : 'ปิดอยู่ — ใช้สีสว่าง'}
                </Typography>
              </Box>
            </Stack>
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#818cf8' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#4f46e5',
                },
              }}
            />
          </Box>

          {darkMode && (
            <Alert severity="info" sx={{ fontSize: '0.8rem', borderRadius: '8px' }}>
              🌙 โหมดมืดเปิดอยู่ — การตั้งค่านี้จะถูกจำไว้สำหรับครั้งถัดไป
            </Alert>
          )}
        </Stack>

        <Divider sx={{ my: 3.5 }} />

        {/* ── ช่องทางการแจ้งเตือน ── */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          ช่องทางการแจ้งเตือน
        </Typography>
        <Stack spacing={1}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="แจ้งเตือนผ่าน LINE OA ทันทีที่มีคำขอใหม่"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="ส่งรายงานสรุปทางอีเมล"
          />
        </Stack>
      </Box>
    </Box>
  )
}
