import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Stack, ToggleButton, ToggleButtonGroup,
  IconButton, MenuItem, Alert, CircularProgress,
} from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import RoomRoundedIcon from '@mui/icons-material/RoomRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS, COMMUNITIES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { uploadImages } from '../../services/uploadService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNotifications } from '../../contexts/NotificationContext.jsx'
import { createRepairSchema } from '../../utils/validationSchemas.js'

export default function CreateRepairRequest() {
  const { user } = useAuth()
  const { notify } = useNotifications()
  const navigate = useNavigate()

  const [coords, setCoords] = useState(null)
  const [geoError, setGeoError] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createRepairSchema),
    mode: 'onTouched',
    defaultValues: {
      category: 'electricity',
      priority: 'normal',
      community: '',
      contactPhone: user?.phone || '',
    },
  })

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length)
    const newImages = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))
    setImages((prev) => [...prev, ...newImages].slice(0, 5))
  }

  const handleShareLocation = () => {
    setGeoError('')
    if (!navigator.geolocation) {
      setGeoError('อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง')
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoLoading(false)
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? 'กรุณาเปิดการเข้าถึงตำแหน่ง (GPS) บนอุปกรณ์ของท่านด้วย'
            : 'ไม่สามารถระบุตำแหน่งได้ กรุณาลองใหม่'
        )
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const onSubmit = async (data) => {
    setServerError('')
    setSubmitting(true)
    try {
      const imageUrls = await uploadImages(images.map((img) => img.file))
      const created = await repairService.create({
        ...data,
        coords,
        reporterId: user.id,
        images: imageUrls,
      })
      notify(`แจ้งซ่อมสำเร็จ หมายเลขคำขอ ${created.id}`)
      navigate('/citizen/track')
    } catch (err) {
      setServerError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h5" fontWeight={800}>แจ้งปัญหาสาธารณูปโภค</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        กรุณากรอกข้อมูลให้ครบถ้วนเพื่อให้เจ้าหน้าที่ดำเนินการได้รวดเร็ว
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{serverError}</Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="card" sx={{ p: 3 }}>

        {/* ── ประเภทปัญหา ── */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Box sx={{ mb: 3 }}>
              <Typography fontWeight={700} sx={{ mb: 1.5 }}>เลือกประเภทปัญหา *</Typography>
              <ToggleButtonGroup
                value={field.value}
                exclusive
                onChange={(_, v) => v && field.onChange(v)}
                sx={{
                  flexWrap: 'wrap', gap: 1,
                  '& .MuiToggleButton-root': {
                    borderRadius: '12px !important',
                    border: '1px solid',
                    borderColor: 'divider',
                    px: 2,
                  },
                }}
              >
                {REPAIR_CATEGORIES.map((c) => (
                  <ToggleButton key={c.value} value={c.value}>
                    <span style={{ marginRight: 6 }}>{c.icon}</span>{c.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {errors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.category.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <Stack spacing={2.5}>

          {/* ── หัวข้อปัญหา ── */}
          <TextField
            label="หัวข้อปัญหา *"
            fullWidth
            placeholder="เช่น ไฟฟ้าดับหน้าซอย"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {/* ── รายละเอียด ── */}
          <TextField
            label="อธิบายปัญหาที่พบ *"
            fullWidth
            multiline
            minRows={3}
            placeholder="เช่น ไฟดับตั้งแต่เช้า ไม่มีไฟในพื้นที่ 3 ซอย"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          {/* ── ชุมชน ── */}
          <Controller
            name="community"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="ชุมชนของผู้แจ้ง (ถ้ามี)"
                fullWidth
                {...field}
              >
                <MenuItem value="">-- เลือกชุมชน (ถ้ามี) --</MenuItem>
                {COMMUNITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            )}
          />

          {/* ── รูปภาพ ── */}
          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>แนบรูปภาพ (ไม่บังคับ)</Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {images.map((img, i) => (
                <Box key={i} sx={{ position: 'relative', width: 84, height: 84 }}>
                  <Box
                    component="img"
                    src={img.preview}
                    sx={{ width: 84, height: 84, borderRadius: 3, objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    sx={{
                      position: 'absolute', top: -8, right: -8,
                      backgroundColor: 'background.paper', boxShadow: 1,
                      '&:hover': { backgroundColor: '#fee2e2' },
                    }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {images.length < 5 && (
                <Button
                  component="label"
                  sx={{
                    width: 84, height: 84, borderRadius: 3,
                    border: '1px dashed', borderColor: 'divider',
                    flexDirection: 'column', gap: 0.5,
                  }}
                >
                  <PhotoCameraRoundedIcon sx={{ color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary">เพิ่มรูป</Typography>
                  <input type="file" hidden accept="image/*" multiple onChange={handleImages} />
                </Button>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">สูงสุด 5 รูป (.jpg, .png)</Typography>
          </Box>

          {/* ── ตำแหน่ง ── */}
          <TextField
            label="ระบุตำแหน่ง / สถานที่เกิดเหตุ"
            fullWidth
            placeholder="เช่น อาคาร A ชั้น 3 ห้อง 301"
            {...register('location')}
          />

          {/* ── พิกัด GPS ── */}
          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>พิกัด (ถ้ามี)</Typography>
            <Box
              sx={{
                height: 160, borderRadius: 3, backgroundColor: 'action.hover',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'text.secondary', gap: 0.5,
              }}
            >
              {coords ? (
                <>
                  <RoomRoundedIcon sx={{ color: '#e0413f', fontSize: 32 }} />
                  <Typography variant="body2" fontWeight={700}>
                    {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  </Typography>
                  <Typography variant="caption">ปักหมุดจากตำแหน่งปัจจุบันของคุณ</Typography>
                </>
              ) : (
                <Typography variant="body2">ยังไม่ได้ระบุพิกัด</Typography>
              )}
            </Box>

            {geoError && (
              <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }}>{geoError}</Alert>
            )}

            <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={geoLoading ? <CircularProgress size={16} /> : <MyLocationRoundedIcon />}
                onClick={handleShareLocation}
                disabled={geoLoading}
              >
                {geoLoading ? 'กำลังระบุตำแหน่ง...' : 'แชร์ตำแหน่งที่ตั้งปัจจุบัน'}
              </Button>
              {coords && (
                <Button variant="text" color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => setCoords(null)}>
                  ลบพิกัด
                </Button>
              )}
            </Stack>
          </Box>

          {/* ── ระดับความเร่งด่วน ── */}
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField select label="ระดับความเร่งด่วน" fullWidth {...field}>
                {PRIORITY_LEVELS.map((p) => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* ── เบอร์ติดต่อกลับ ── */}
          <TextField
            label="เบอร์ติดต่อกลับ *"
            fullWidth
            type="tel"
            placeholder="0812345678"
            {...register('contactPhone')}
            error={!!errors.contactPhone}
            helperText={errors.contactPhone?.message}
          />

          <Button type="submit" size="large" variant="contained" disabled={submitting}>
            {submitting ? 'กำลังส่งคำขอ...' : 'ส่งการแจ้งซ่อม'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}