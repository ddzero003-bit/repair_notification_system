/**
 * PublicReportForm — หน้าฟอร์มแจ้งซ่อมสาธารณะ เทศบาลตำบลสงเปลือย
 * รองรับทั้งแบบ Token (48 ชม.) และ Rich Menu (ไม่มี token)
 */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Stack,
  IconButton, Alert, CircularProgress, Paper,
  RadioGroup, FormControlLabel, Radio, Divider,
} from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { uploadImages } from '../../services/uploadService.js'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import { publicReportSchema } from '../../utils/validationSchemas.js'

// ===== Leaflet Map Hook =====
function useLeafletMap(mapElRef, coords, onMapClick) {
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!coords || !mapElRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!mapRef.current) {
        const map = L.map(mapElRef.current).setView([coords.lat, coords.lng], 16)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)

        const marker = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map)
        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          onMapClick(pos.lat, pos.lng)
        })

        map.on('click', (e) => {
          marker.setLatLng(e.latlng)
          onMapClick(e.latlng.lat, e.latlng.lng)
        })

        markerRef.current = marker
        mapRef.current = map
      } else {
        mapRef.current.setView([coords.lat, coords.lng], mapRef.current.getZoom())
        if (markerRef.current) markerRef.current.setLatLng([coords.lat, coords.lng])
      }
    }

    initMap()
  }, [coords, onMapClick])
}

export default function PublicReportForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [checking, setChecking] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenError, setTokenError] = useState('')
  const [isRichMenu, setIsRichMenu] = useState(false)

  const [category, setCategory] = useState('electricity')
  const [coords, setCoords] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [images, setImages] = useState([])
  const [imagesError, setImagesError] = useState('')
  const [coordsError, setCoordsError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const mapElRef = useRef(null)

  const handleMapClick = useCallback((lat, lng) => {
    setCoords({ lat, lng })
    setCoordsError('')
  }, [])

  useLeafletMap(mapElRef, coords, handleMapClick)

  useEffect(() => {
    if (!token) {
      setIsRichMenu(true)
      setTokenValid(true)
      setChecking(false)
      handleGetGPS()
      return
    }

    fetch(`/api/public/verify-token?token=${encodeURIComponent(token)}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true)
          handleGetGPS()
        } else {
          setTokenValid(false)
          setTokenError(data.message || 'ลิงก์นี้หมดอายุหรือไม่ถูกต้อง')
        }
      })
      .catch(() => {
        setTokenValid(true)
        handleGetGPS()
      })
      .finally(() => setChecking(false))
  }, [token])

  const handleGetGPS = () => {
    setGpsLoading(true)
    setGpsError('')
    if (!navigator.geolocation) {
      setGpsError('อุปกรณ์ไม่รองรับ GPS')
      setGpsLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGpsLoading(false)
      },
      () => {
        setCoords({ lat: 16.200000, lng: 103.270000 })
        setGpsError('ไม่สามารถดึงพิกัดอัตโนมัติได้ — กรุณาแตะเลือกตำแหน่งบนแผนที่')
        setGpsLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const remaining = 3 - images.length
    const allowed = files.slice(0, remaining)
    const newItems = allowed.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))
    setImages((prev) => [...prev, ...newItems])
    setImagesError('')
  }

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  // ── react-hook-form ──
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(publicReportSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data) => {
    // Validate custom fields (images + coords) ที่ไม่อยู่ใน yup
    let hasError = false
    if (images.length === 0) { setImagesError('กรุณาแนบรูปภาพอย่างน้อย 1 รูป'); hasError = true }
    else { setImagesError('') }
    if (!coords) { setCoordsError('กรุณาเลือกตำแหน่งบนแผนที่'); hasError = true }
    else { setCoordsError('') }
    if (hasError) return

    setSubmitting(true)
    setSubmitError('')

    try {
      let imageUrls = []
      if (images.length > 0) {
        imageUrls = await uploadImages(images.map((img) => img.file))
      }

      const fullLocation = data.locationName.trim()
      const payload = {
        token,
        name: data.name.trim(),
        contactPhone: data.phone.trim(),
        category,
        title: `${category === 'electricity' ? 'งานไฟฟ้า' : 'งานประปา'} - ${data.locationName.trim()}`,
        description: data.problemDesc.trim(),
        location: fullLocation,
        coords: { lat: coords.lat, lng: coords.lng },
        images: imageUrls,
      }

      const res = await fetch('/api/public/repairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payload),
      })

      const resData = await res.json()
      if (!res.ok) throw new Error(resData.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล')

      navigate(`/report/success/${resData.id}`)
    } catch (err) {
      setSubmitError(err.message || 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
          <Typography variant="body2" color="text.secondary">
            {token ? 'กำลังตรวจสอบความถูกต้องของลิงก์...' : 'กำลังเตรียมฟอร์มแจ้งซ่อม...'}
          </Typography>
        </Stack>
      </Box>
    )
  }

  if (!tokenValid && token) {
    return (
      <Box sx={{ minHeight: '100vh', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <Paper className="card" sx={{ p: 4, maxWidth: 400, textAlign: 'center', width: '100%' }}>
          <Typography variant="h6" fontWeight={700} color="#b91c1c" sx={{ mb: 1 }}>
            ลิงก์หมดอายุแล้ว
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tokenError}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            💡 ลิงก์ที่ได้รับจาก LINE มีอายุ 48 ชั่วโมง กรุณาพิมพ์ "แจ้งซ่อม" ใน LINE ใหม่เพื่อรับลิงก์ใหม่
          </Typography>
          <Button
            fullWidth
            variant="contained"
            href="https://line.me/R/ti/p/@yourlineoa"
            sx={{ backgroundColor: '#06c755', fontWeight: 600, '&:hover': { backgroundColor: '#05a847' } }}
          >
            กลับ LINE เพื่อขอลิงก์ใหม่
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: { xs: 2.5, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ maxWidth: 580, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
            เทศบาลตำบลสงเปลือย · กองช่าง
          </Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            แบบฟอร์มแจ้งซ่อมสาธารณูปโภค
          </Typography>
        </Box>

        {/* Banner */}
        {isRichMenu ? (
          <Alert severity="info" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.82rem' }}>
            <strong>📱 เข้าผ่านเมนู LINE</strong> — กรอกข้อมูลและส่งแจ้งซ่อมได้เลยครับ
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.82rem' }}>
            <strong>✅ ลิงก์ถูกต้อง</strong> — ผูกกับบัญชี LINE ของคุณแล้ว
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '6px' }}>{submitError}</Alert>
        )}

        <Paper className="card" sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>

              {/* 1. ประเภทปัญหา */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  ประเภทปัญหาที่แจ้ง *
                </Typography>
                <RadioGroup row value={category} onChange={(e) => setCategory(e.target.value)}>
                  {REPAIR_CATEGORIES.map((cat) => (
                    <FormControlLabel
                      key={cat.value}
                      value={cat.value}
                      control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#3b82f6' } }} />}
                      label={<Typography variant="body2" fontWeight={600}>{cat.label}</Typography>}
                      sx={{ mr: 4 }}
                    />
                  ))}
                </RadioGroup>
              </Box>

              <Divider />

              {/* 2. ข้อมูลผู้แจ้ง */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  ข้อมูลผู้แจ้ง *
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="ชื่อ-นามสกุล ผู้แจ้ง *"
                    size="small"
                    fullWidth
                    placeholder="เช่น นายสมบูรณ์ ใจดี"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    label="เบอร์โทรศัพท์ *"
                    size="small"
                    fullWidth
                    type="tel"
                    placeholder="เช่น 0812345678"
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* 3. สถานที่และรายละเอียด */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  สถานที่และรายละเอียดปัญหา *
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="จุดสังเกต / สถานที่ *"
                    size="small"
                    fullWidth
                    placeholder="เช่น หน้าโรงเรียน, เยื้องวัด, ซอย 3 หรือระบุหมู่บ้าน/พื้นที่"
                    {...register('locationName')}
                    error={!!errors.locationName}
                    helperText={errors.locationName?.message}
                  />

                  <TextField
                    label="รายละเอียดปัญหา *"
                    size="small"
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="ระบุอาการชำรุดหรือความเสียหายที่พบ..."
                    {...register('problemDesc')}
                    error={!!errors.problemDesc}
                    helperText={errors.problemDesc?.message}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* 4. รูปภาพ */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    รูปภาพจุดเกิดเหตุ *
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {images.length}/3 รูป
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
                  {images.map((img, i) => (
                    <Box key={i} sx={{ position: 'relative', width: 80, height: 80 }}>
                      <Box
                        component="img"
                        src={img.preview}
                        sx={{ width: 80, height: 80, borderRadius: '6px', objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(i)}
                        sx={{
                          position: 'absolute', top: -6, right: -6,
                          backgroundColor: '#b91c1c', color: '#ffffff', p: 0.25,
                          '&:hover': { backgroundColor: '#7f1d1d' },
                        }}
                      >
                        <CloseRoundedIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}

                  {images.length < 3 && (
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{
                        width: 80, height: 80, borderRadius: '6px',
                        border: '1px dashed', borderColor: imagesError ? 'error.main' : 'divider',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 0.25,
                        color: imagesError ? 'error.main' : 'text.secondary',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <PhotoCameraRoundedIcon sx={{ fontSize: 22 }} />
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                        + แนบรูป
                      </Typography>
                      <input type="file" hidden accept="image/*" multiple onChange={handleImageChange} />
                    </Button>
                  )}
                </Stack>

                {imagesError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.75, display: 'block' }}>
                    {imagesError}
                  </Typography>
                )}
              </Box>

              <Divider />

              {/* 5. แผนที่ GPS */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    พิกัดแผนที่ (GPS) *
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<MyLocationRoundedIcon />}
                    onClick={handleGetGPS}
                    disabled={gpsLoading}
                    sx={{ fontSize: '0.75rem', py: 0.25 }}
                  >
                    {gpsLoading ? 'กำลังดึง...' : 'ดึงพิกัดปัจจุบัน'}
                  </Button>
                </Stack>

                {gpsError && (
                  <Alert severity="warning" sx={{ mb: 1, borderRadius: '6px', fontSize: '0.75rem' }}>
                    {gpsError}
                  </Alert>
                )}

                {coords && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    พิกัด: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)} (แตะหรือลากหมุดบนแผนที่ได้)
                  </Typography>
                )}

                <Box
                  ref={mapElRef}
                  sx={{
                    height: 220, borderRadius: '6px', overflow: 'hidden',
                    border: '1px solid',
                    borderColor: coordsError ? 'error.main' : 'divider',
                  }}
                />

                {coordsError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.75, display: 'block' }}>
                    {coordsError}
                  </Typography>
                )}
              </Box>

              {/* Submit */}
              <Box sx={{ pt: 1 }}>
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    fontWeight: 600, fontSize: '1rem',
                    py: 1.25, borderRadius: '8px',
                  }}
                >
                  {submitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลแจ้งซ่อม'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
