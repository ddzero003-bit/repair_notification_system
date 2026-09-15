import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  TextField, Button, Typography, Box, Stack, MenuItem,
  Alert, InputAdornment, IconButton, LinearProgress,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { ROLES } from '../../utils/constants.js'
import { registerSchema } from '../../utils/validationSchemas.js'

// วัดความแข็งแกร่งของรหัสผ่าน 0-4
function getPasswordStrength(password = '') {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabel = ['', 'อ่อนมาก', 'อ่อน', 'ปานกลาง', 'แข็งแกร่ง']
const strengthColor = ['', 'error', 'warning', 'info', 'success']

export default function Register() {
  const { register: registerAuth } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { role: ROLES.CITIZEN },
  })

  // Watch password เพื่อแสดง strength meter
  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })
  const strength = getPasswordStrength(passwordValue)

  const onSubmit = async (data) => {
    setServerError('')
    setLoading(true)
    try {
      const user = await registerAuth(data)
      navigate(user.role === ROLES.CITIZEN ? '/citizen' : '/login')
    } catch (err) {
      setServerError(err.message || 'เกิดข้อผิดพลาดในการลงทะเบียน')
    } finally {
      setLoading(false)
    }
  }

  // Password rule hints
  const rules = [
    { label: 'อย่างน้อย 8 ตัวอักษร', pass: passwordValue.length >= 8 },
    { label: 'มีตัวอักษร (a-z หรือ A-Z)', pass: /[A-Za-z]/.test(passwordValue) },
    { label: 'มีตัวเลข (0-9)', pass: /[0-9]/.test(passwordValue) },
  ]

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>ลงทะเบียนผู้ใช้งาน</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        สร้างบัญชีเพื่อเริ่มแจ้งปัญหาสาธารณูปโภคในพื้นที่ของคุณ
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{serverError}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
        <Stack spacing={2.5}>
          {/* ชื่อ-นามสกุล */}
          <TextField
            label="ชื่อ-นามสกุล *"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* ชื่อผู้ใช้ */}
          <TextField
            label="ชื่อผู้ใช้ *"
            fullWidth
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message || 'ใช้ได้แค่ a-z, A-Z, 0-9 และ _ (3-30 ตัว)'}
          />

          {/* เบอร์โทร */}
          <TextField
            label="เบอร์โทรศัพท์ *"
            fullWidth
            type="tel"
            placeholder="0812345678"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          {/* ประเภทผู้ใช้ */}
          <TextField
            select
            label="ประเภทผู้ใช้ *"
            fullWidth
            defaultValue={ROLES.CITIZEN}
            {...register('role')}
            error={!!errors.role}
            helperText={errors.role?.message}
          >
            <MenuItem value={ROLES.CITIZEN}>ประชาชน (ผู้แจ้งซ่อม)</MenuItem>
            <MenuItem value={ROLES.OPERATOR}>หัวหน้าช่าง (Operator)</MenuItem>
            <MenuItem value={ROLES.TECHNICIAN}>ช่างซ่อม (Technician)</MenuItem>
          </TextField>

          {/* รหัสผ่าน */}
          <Box>
            <TextField
              label="รหัสผ่าน *"
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

            {/* Password Strength Meter */}
            {passwordValue.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">ความแข็งแกร่ง:</Typography>
                  <Typography variant="caption" color={`${strengthColor[strength]}.main`} fontWeight={600}>
                    {strengthLabel[strength]}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(strength / 4) * 100}
                  color={strengthColor[strength] || 'error'}
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  {rules.map((r) => (
                    <Stack key={r.label} direction="row" alignItems="center" spacing={0.5}>
                      {r.pass
                        ? <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14, color: 'success.main' }} />
                        : <CancelOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      }
                      <Typography variant="caption" color={r.pass ? 'success.main' : 'text.secondary'}>
                        {r.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          {/* ยืนยันรหัสผ่าน */}
          <TextField
            label="ยืนยันรหัสผ่าน *"
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end" size="small">
                    {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" size="large" variant="contained" disabled={loading}>
            {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 3 }} color="text.secondary">
        มีบัญชีอยู่แล้ว?{' '}
        <Typography component={Link} to="/login" variant="body2" sx={{ color: '#2f63f6', fontWeight: 700, textDecoration: 'none' }}>
          เข้าสู่ระบบ
        </Typography>
      </Typography>
    </Box>
  )
}
