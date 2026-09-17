import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Box, Typography, Grid, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  RadioGroup, FormControlLabel, Radio, ToggleButtonGroup, ToggleButton, TextField, Stack,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import RepairTimeline from '../../components/common/RepairTimeline.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

// ===== Leaflet Map Component =====
function GpsMap({ coords }) {
  const mapElRef = useRef(null)
  const mapRef = useRef(null)

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
        L.marker([coords.lat, coords.lng])
          .addTo(map)
          .bindPopup('พิกัดที่แจ้ง')
          .openPopup()
        mapRef.current = map
      }
    }
    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [coords])

  if (!coords) return null

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="body2" fontWeight={600} color="#0f172a">
          พิกัดแผนที่ (GPS)
        </Typography>
        <Button
          size="small"
          variant="text"
          endIcon={<OpenInNewRoundedIcon fontSize="small" />}
          href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ fontSize: '0.75rem', color: '#3b82f6' }}
        >
          เปิดใน Google Maps
        </Button>
      </Stack>
      <Box
        ref={mapElRef}
        sx={{ height: 240, borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0' }}
      />
    </Box>
  )
}

export default function RequestDetails() {
  const { id } = useParams()
  const { notify } = useNotifications()
  const [request, setRequest] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState('')
  const [priority, setPriority] = useState('normal')
  const [note, setNote] = useState('')

  const load = () =>
    repairService.getById(id).then((r) => {
      setRequest(r)
      setPriority(r.priority || 'normal')
      if (r.technicianId) setSelectedTech(String(r.technicianId))
    })

  useEffect(() => {
    load()
    repairService.listTechnicians().then(setTechnicians)
  }, [id])

  const handleAssign = async () => {
    await repairService.assignTechnician(id, Number(selectedTech), priority)
    notify('มอบหมายงานให้ช่างเรียบร้อยแล้ว')
    setAssignOpen(false)
    load()
  }

  if (!request) return <Spinner />

  const category = REPAIR_CATEGORIES.find((c) => c.value === request.category)
  const assignedTech = technicians.find((t) => t.id === request.technicianId)
  const priorityInfo = PRIORITY_LEVELS.find((p) => p.value === request.priority)

  return (
    <Box>
      <Button
        component={Link}
        to="/operator/requests"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 2, color: '#475569', fontWeight: 500 }}
      >
        กลับไปรายการคำขอ
      </Button>

      <Grid container spacing={2.5}>
        {/* Left: Case Info & Map */}
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {request.id}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#0f172a">
                  {request.title}
                </Typography>
              </Box>
              <StatusBadge status={request.status} />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                size="small"
                label={category?.label || 'ทั่วไป'}
                sx={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600 }}
              />
              <Chip
                size="small"
                label={`ระดับ: ${priorityInfo?.label || 'ปกติ'}`}
                sx={{
                  backgroundColor: priorityInfo?.badgeBg || '#f1f5f9',
                  color: priorityInfo?.badgeText || '#475569',
                  fontWeight: 600,
                }}
              />
            </Stack>

            {/* Description */}
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', mb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                รายละเอียดปัญหา:
              </Typography>
              <Typography variant="body2" color="#1e293b">
                {request.description || request.problemDesc || 'ไม่มีรายละเอียดเพิ่มเติม'}
              </Typography>
            </Box>

            {/* Meta Data */}
            <Stack spacing={0.75} sx={{ mb: 2 }}>
              <Typography variant="body2" color="#334155">
                <b>สถานที่:</b> {request.location || request.locationName || '-'}
              </Typography>
              <Typography variant="body2" color="#334155">
                <b>วันที่แจ้ง:</b> {dayjs(request.createdAt).format('D MMMM YYYY HH:mm น.')}
              </Typography>
              <Typography variant="body2" color="#334155">
                <b>ชื่อผู้แจ้ง:</b> {request.reporterName || 'ไม่ระบุ'}
              </Typography>
              {request.contactPhone && (
                <Typography variant="body2" color="#334155">
                  <b>เบอร์ติดต่อผู้แจ้ง:</b>{' '}
                  <a href={`tel:${request.contactPhone}`} style={{ color: '#3b82f6', fontWeight: 600 }}>
                    {request.contactPhone}
                  </a>
                </Typography>
              )}
            </Stack>

            {/* Before Photos */}
            {request.images?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#0f172a" sx={{ mb: 1 }}>
                  รูปภาพจุดเกิดเหตุ ({request.images.length} รูป)
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {request.images.map((src, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={src}
                      alt="รูปแจ้งซ่อม"
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: '6px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: '1px solid #cbd5e1',
                      }}
                      onClick={() => window.open(src, '_blank')}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* After Photos */}
            {request.imagesAfter?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#15803d" sx={{ mb: 1 }}>
                  รูปภาพหลังซ่อมเสร็จ
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {request.imagesAfter.map((src, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={src}
                      alt="รูปหลังซ่อม"
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: '6px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: '1px solid #bbf7d0',
                      }}
                      onClick={() => window.open(src, '_blank')}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* GPS Map */}
            {request.coords && <GpsMap coords={request.coords} />}

            {/* Rejection Notice */}
            {request.status === 'rejected' && request.repairResult && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
                <Typography variant="body2" fontWeight={600} color="#b91c1c">
                  ช่างปฏิเสธงานนี้:
                </Typography>
                <Typography variant="body2" color="#7f1d1d">
                  {request.repairResult.replace('[ปฏิเสธ] ', '')}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right: Timeline & Assign */}
        <Grid item xs={12} md={4}>
          <Box className="card" sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
              ความคืบหน้าการซ่อม
            </Typography>
            <RepairTimeline status={request.status} />
          </Box>

          <Box className="card" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
              ช่างผู้รับผิดชอบ
            </Typography>

            {assignedTech ? (
              <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <Typography variant="body2" fontWeight={600} color="#0f172a">
                  {assignedTech.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ช่าง{assignedTech.specialty || 'ประจำการ'} · โทร: {assignedTech.phone || '-'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                ยังไม่ได้มอบหมายงาน
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={() => setAssignOpen(true)}
              sx={{
                mt: 2,
                backgroundColor: request.status === 'rejected' ? '#dc2626' : '#3b82f6',
                fontWeight: 600,
                '&:hover': { backgroundColor: request.status === 'rejected' ? '#b91c1c' : '#2563eb' },
              }}
            >
              {request.status === 'rejected'
                ? '⚠️ มอบหมายช่างคนใหม่'
                : assignedTech
                ? 'เปลี่ยนช่างผู้รับผิดชอบ'
                : 'มอบหมายงานให้ช่าง'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Modal: มอบหมายงาน */}
      <Dialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '8px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#0f172a' }}>
          มอบหมายงานซ่อม
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            เลือกช่างผู้รับผิดชอบ:
          </Typography>
          <RadioGroup value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)}>
            {technicians.map((t) => (
              <FormControlLabel
                key={t.id}
                value={String(t.id)}
                control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#3b82f6' } }} />}
                label={
                  <Box sx={{ py: 0.25 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {t.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ช่าง{t.specialty} · {t.phone}
                    </Typography>
                  </Box>
                }
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  mx: 0,
                  mb: 1,
                  px: 1,
                }}
              />
            ))}
          </RadioGroup>

          <Typography variant="body2" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            ระดับความสำคัญ:
          </Typography>
          <ToggleButtonGroup
            value={priority}
            exclusive
            onChange={(_, v) => v && setPriority(v)}
            size="small"
            fullWidth
          >
            {PRIORITY_LEVELS.map((p) => (
              <ToggleButton key={p.value} value={p.value} sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                {p.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignOpen(false)}>ยกเลิก</Button>
          <Button
            variant="contained"
            disabled={!selectedTech}
            onClick={handleAssign}
            sx={{ backgroundColor: '#3b82f6', fontWeight: 600 }}
          >
            ยืนยันมอบหมายงาน
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
