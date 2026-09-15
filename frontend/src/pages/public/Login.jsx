import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  TextField, Button, Typography, Box, Stack, Alert,
  InputAdornment, IconButton, Chip, Divider,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
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
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema), mode: 'onTouched' })

  const onSubmit = async (data) => {
    setServerError('')
    setLoading(true)
    try {
      const user = await login(data)
      const from = location.state?.from?.pathname
      navigate(from || roleHome[user.role] || '/', { replace: true })
    } catch (err) {
      setServerError(err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoFill = (username) => {
    setValue('username', username, { shouldValidate: true })
    setValue('password', 'password', { shouldValidate: true })
  }

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          เข้าสู่ระบบเจ้าหน้าที่
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          สำหรับหัวหน้าช่างและช่างซ่อมภาคสนาม
        </Typography>
      </Box>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '6px' }}>
          {serverError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            label="ชื่อผู้ใช้"
            size="small"
            fullWidth
            placeholder="เช่น operator1 หรือ tech1"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            label="รหัสผ่าน"
            size="small"
            type={showPassword ? 'text' : 'password'}
            fullWidth
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
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              fontWeight: 600,
              py: 1,
              borderRadius: '6px',
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </Stack>
      </Box>

      {/* Quick Demo Credentials */}
      <Box sx={{ mt: 2.5, p: 1.5, backgroundColor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: '6px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
          บัญชีทดสอบระบบ:
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            size="small"
            label="หัวหน้าช่าง (operator1)"
            onClick={() => handleDemoFill('operator1')}
            sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
          />
          <Chip
            size="small"
            label="ช่างซ่อม (tech1)"
            onClick={() => handleDemoFill('tech1')}
            sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Citizen Redirect */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          สำหรับประชาชน: แจ้งซ่อมหรือติดตามสถานะได้โดยตรงโดยไม่ต้องลงชื่อเข้าใช้
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
          <Link to="/check-status" style={{ fontSize: '0.8125rem', color: '#1b3752', fontWeight: 600 }}>
            ตรวจสอบสถานะ
          </Link>
          <a
            href="https://line.me/R/ti/p/@yourlineoa"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8125rem', color: '#15803d', fontWeight: 600 }}
          >
            แจ้งซ่อมผ่าน LINE
          </a>
        </Stack>
      </Box>
    </Box>
  )
}