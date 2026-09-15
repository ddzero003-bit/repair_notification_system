import React, { useState, useRef } from 'react'
import {
  Box, Typography, Avatar, TextField, Button, Stack, Grid,
  Divider, CircularProgress, Alert, InputAdornment, IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'
import apiClient from '../../services/apiClient.js'
import { uploadImages } from '../../services/uploadService.js'
import { profileSchema, changePasswordSchema } from '../../utils/validationSchemas.js'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { notify } = useNotifications()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const fileInputRef = useRef(null)

  // ── ฟอร์ม 1: ข้อมูลส่วนตัว ──
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: 'onTouched',
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
  })

  // ── ฟอร์ม 2: เปลี่ยนรหัสผ่าน ──
  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onTouched',
  })

  // ── อัปโหลดรูปโปรไฟล์ ──
  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const urls = await uploadImages([file])
      if (urls?.length > 0) {
        await apiClient.put('/profile', { avatar_url: urls[0] })
        updateUser({ avatar_url: urls[0] })
        notify('อัปเดตรูปโปรไฟล์สำเร็จ')
      }
    } catch {
      notify('อัปโหลดรูปภาพไม่สำเร็จ', 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── บันทึกข้อมูลส่วนตัว ──
  const saveProfile = async (data) => {
    setSaving(true)
    try {
      await apiClient.put('/profile', data)
      updateUser(data)
      notify('บันทึกข้อมูลส่วนตัวสำเร็จ')
    } catch {
      notify('เกิดข้อผิดพลาดในการบันทึก', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── เปลี่ยนรหัสผ่าน ──
  const changePassword = async (data) => {
    setSaving(true)
    try {
      await apiClient.put('/profile', { password: data.next })
      resetPw()
      notify('เปลี่ยนรหัสผ่านสำเร็จ')
    } catch {
      notify('เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const togglePw = (field) => setShowPw((s) => ({ ...s, [field]: !s[field] }))

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        ข้อมูลส่วนตัวและบัญชีผู้ใช้
      </Typography>

      <Grid container spacing={3}>
        {/* ── Avatar ── */}
        <Grid item xs={12} md={4}>
          <Box className="card" sx={{ p: 3.5, textAlign: 'center', position: 'relative' }}>
            <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={user?.avatar_url || ''}
                onClick={handleAvatarClick}
                sx={{
                  width: 88, height: 88, mx: 'auto',
                  bgcolor: 'primary.main', color: 'primary.contrastText',
                  fontSize: 34, fontWeight: 700,
                  cursor: 'pointer', opacity: uploading ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {!user?.avatar_url && (user?.name?.[0] || 'U')}
              </Avatar>
              {uploading && (
                <CircularProgress
                  size={30}
                  sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-15px', ml: '-15px' }}
                />
              )}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mt: 2 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              @{user?.username} · {user?.role === 'operator' ? 'หัวหน้าช่าง' : 'ช่างประจำการ'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              คลิกที่รูปเพื่อเปลี่ยนโปรไฟล์
            </Typography>
          </Box>
        </Grid>

        {/* ── ฟอร์มข้อมูล ── */}
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: 3.5 }}>

            {/* ข้อมูลส่วนตัว */}
            <Typography variant="h6" sx={{ mb: 2 }}>แก้ไขข้อมูลการติดต่อ</Typography>
            <Box component="form" onSubmit={handleProfile(saveProfile)} noValidate>
              <Stack spacing={2}>
                <TextField
                  label="ชื่อ-นามสกุล *"
                  fullWidth
                  {...regProfile('name')}
                  error={!!profileErrors.name}
                  helperText={profileErrors.name?.message}
                />
                <TextField
                  label="เบอร์โทรศัพท์ *"
                  fullWidth
                  type="tel"
                  placeholder="0812345678"
                  {...regProfile('phone')}
                  error={!!profileErrors.phone}
                  helperText={profileErrors.phone?.message}
                />
                <TextField
                  label="อีเมล"
                  fullWidth
                  type="email"
                  placeholder="example@email.com"
                  {...regProfile('email')}
                  error={!!profileErrors.email}
                  helperText={profileErrors.email?.message || 'ไม่บังคับ'}
                />
                <Box sx={{ pt: 1 }}>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลส่วนตัว'}
                  </Button>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 3.5 }} />

            {/* เปลี่ยนรหัสผ่าน */}
            <Typography variant="h6" sx={{ mb: 2 }}>เปลี่ยนรหัสผ่าน</Typography>
            <Box component="form" onSubmit={handlePw(changePassword)} noValidate>
              <Stack spacing={2}>
                {[
                  { name: 'current', label: 'รหัสผ่านปัจจุบัน', key: 'current' },
                  { name: 'next', label: 'รหัสผ่านใหม่ (ขั้นต่ำ 8 ตัว)', key: 'next' },
                  { name: 'confirm', label: 'ยืนยันรหัสผ่านใหม่', key: 'confirm' },
                ].map(({ name, label, key }) => (
                  <TextField
                    key={name}
                    label={label}
                    type={showPw[key] ? 'text' : 'password'}
                    fullWidth
                    {...regPw(name)}
                    error={!!pwErrors[name]}
                    helperText={pwErrors[name]?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => togglePw(key)} edge="end" size="small">
                            {showPw[key] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))}

                <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
                  รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร มีตัวอักษรและตัวเลขอย่างน้อยอย่างละ 1 ตัว
                </Alert>

                <Box sx={{ pt: 1 }}>
                  <Button type="submit" variant="outlined" disabled={saving}>
                    {saving ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
