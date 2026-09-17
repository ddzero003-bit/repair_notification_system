import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  TextField, Button, Typography, Box, Stack, Alert,
  InputAdornment, IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { ROLES } from '../../utils/constants.js'
import { loginSchema } from '../../utils/validationSchemas.js'

const roleHome = {
  [ROLES.CITIZEN]: '/citizen',
  [ROLES.OPERATOR]: '/operator',
  [ROLES.TECHNICIAN]: '/technician',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema), mode: 'onTouched' })

  const onSubmit = async (data) => {
    setServerError('')
    setLoading(true)
    try {
      const user = await login(data)
      const from = location.state?.from?.pathname
      const isAllowedFrom = from && from.startsWith(`/${user.role}`)
      navigate(isAllowedFrom ? from : (roleHome[user.role] || '/'), { replace: true })
    } catch (err) {
      setServerError(err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {/* Header with blue badge icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            flexShrink: 0,
          }}
        >
          <BadgeRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
            เข้าสู่ระบบเจ้าหน้าที่
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.35, display: 'block', fontSize: '0.75rem' }}>
            สำหรับหัวหน้าช่าง (Operator) และช่างซ่อม (Technician)
          </Typography>
        </Box>
      </Box>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', fontSize: '0.85rem' }}>
          {serverError}
        </Alert>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            label="ชื่อผู้ใช้ *"
            size="small"
            fullWidth
            placeholder="เช่น operator1 หรือ tech1"
            InputLabelProps={{ shrink: true }}
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <TextField
            label="รหัสผ่าน *"
            size="small"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            placeholder="••••••••"
            InputLabelProps={{ shrink: true }}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#2563eb',
              fontWeight: 700,
              py: 1.2,
              borderRadius: '8px',
              fontSize: '0.925rem',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
              mt: 0.5,
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}