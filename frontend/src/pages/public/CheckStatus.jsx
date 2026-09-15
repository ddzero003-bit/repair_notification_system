/**
 * CheckStatus — หน้าตรวจสอบสถานะคำขอแจ้งซ่อมสาธารณะ
 * Route: /check-status
 * ออกแบบตาม UI ที่ผู้ใช้กำหนด: การ์ดเดี่ยวสะอาดตา, Timeline ไอคอนเช็คถูกเขียว,
 * รูปภาพตอนแจ้ง/หลังซ่อมเสร็จเป็น Thumbnail วงกลมกดขยายได้, และไม่มีส่วนเปรียบเทียบ Before/After
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container, Box, Typography, TextField, Button, Stack, Alert,
  InputAdornment, Divider, Paper, Dialog, IconButton,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { repairService } from '../../services/repairService.js'
import { REPAIR_CATEGORIES, STATUS_COLOR } from '../../utils/constants.js'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

dayjs.locale('th')

// ลำดับขั้นตอนทั้ง 5 ขั้น
const TIMELINE_STEPS = [
  { value: 'reported', label: 'แจ้งแล้ว' },
  { value: 'accepted', label: 'รับเรื่องแล้ว' },
  { value: 'assigned', label: 'มอบหมายงานแล้ว' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
]

export default function CheckStatus() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialId = searchParams.get('id') || ''

  const [code, setCode] = useState(initialId)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const doSearch = useCallback(async (searchCode) => {
    const q = (searchCode || '').trim().toUpperCase()
    if (!q) return
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const found = await repairService.getById(q)
      setResult(found)
    } catch {
      setError('ไม่พบข้อมูลคำขอนี้ในระบบ กรุณาตรวจสอบหมายเลขคำขออีกครั้ง')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialId) {
      setCode(initialId)
      doSearch(initialId)
    }
  }, [initialId, doSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    setSearchParams({ id: trimmed })
    doSearch(trimmed)
  }

  const handleReset = () => {
    setCode('')
    setResult(null)
    setError('')
    setSearchParams({})
  }

  const cat = REPAIR_CATEGORIES.find((c) => c.value === result?.category)
  const statusInfo = result ? (STATUS_COLOR[result.status] || STATUS_COLOR.pending) : null
  const beforeImages = result?.images || []
  const afterImages = result?.imagesAfter || []

  // คำนวณ index สำหรับ timeline
  const getStepStatus = (stepIndex) => {
    if (!result) return 'upcoming'
    const statusOrder = ['reported', 'accepted', 'assigned', 'in_progress', 'completed']
    const currentIndex = statusOrder.indexOf(result.status)
    if (currentIndex === -1) {
      if (result.status === 'rejected' && stepIndex <= 2) return 'done'
      return 'upcoming'
    }
    if (stepIndex <= currentIndex) return 'done'
    return 'upcoming'
  }

  return (
    <Box sx={{ py: { xs: 3, md: 6 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xs" sx={{ maxWidth: '500px !important' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          }}
        >
          {/* ─── Top Search Icon Circle ─── */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <SearchRoundedIcon sx={{ color: '#2563eb', fontSize: 24 }} />
          </Box>

          {/* ─── Title & Subtitle ─── */}
          <Typography variant="h6" fontWeight={800} color="#0f172a" align="center" sx={{ fontSize: '1.2rem' }}>
            ติดตามสถานะการแจ้งซ่อม
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5, mb: 2.5 }}>
            กรอกรหัสติดตามที่ได้รับหลังแจ้งซ่อมเพื่อดูสถานะ
          </Typography>

          {/* ─── Search Box Form ─── */}
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              size="small"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))}
              placeholder="SR2569-016"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '1rem', mr: 0.5 }}>#</Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.725rem', mt: 0.75, display: 'block' }}>
              กรอกได้เฉพาะตัวเลขหรืออักษรภาษาอังกฤษ (ไม่เว้นวรรค)
            </Typography>

            {/* ปุ่ม ค้นหา / ล้างค่า */}
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}
                disabled={loading || !code.trim()}
                sx={{
                  backgroundColor: '#2563eb',
                  fontWeight: 700,
                  borderRadius: '8px',
                  px: 2.75,
                  py: 0.85,
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
                }}
              >
                {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                startIcon={<RestartAltRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={handleReset}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#2563eb',
                  fontWeight: 700,
                  borderRadius: '8px',
                  px: 2,
                  py: 0.85,
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                  '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
                }}
              >
                ล้างค่า
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mt: 2.5, borderRadius: '8px', fontSize: '0.825rem' }}>
              {error}
            </Alert>
          )}

          {/* ─── Result Section ─── */}
          {result && (
            <Box sx={{ mt: 3.5, pt: 3, borderTop: '1px solid #f1f5f9' }}>
              {/* Header Info */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>
                  {result.id}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.25,
                    py: 0.25,
                    borderRadius: '12px',
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.color,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: `1px solid ${statusInfo.border || 'transparent'}`,
                  }}
                >
                  {statusInfo.label}
                </Box>
              </Stack>

              {/* Title */}
              <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mt: 0.5, fontSize: '1.2rem' }}>
                {result.title || cat?.label || 'แจ้งซ่อม'}
              </Typography>

              {/* Subtitle / Category & Date */}
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.25 }}>
                {cat?.label || 'ทั่วไป'} · แจ้งเมื่อ {dayjs(result.createdAt).format('D MMM YYYY HH:mm')}
              </Typography>

              {/* ─── Timeline 5 ขั้นตอน (สีเขียวแบบ Checkmark) ─── */}
              <Box sx={{ mt: 3 }}>
                {TIMELINE_STEPS.map((step, idx) => {
                  const state = getStepStatus(idx)
                  const isDone = state === 'done'
                  const isLast = idx === TIMELINE_STEPS.length - 1

                  return (
                    <Box key={step.value} sx={{ display: 'flex', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isDone ? (
                          <CheckCircleRoundedIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        ) : (
                          <RadioButtonUncheckedRoundedIcon sx={{ color: '#cbd5e1', fontSize: 18 }} />
                        )}
                        {!isLast && (
                          <Box
                            sx={{
                              width: 2,
                              flex: 1,
                              minHeight: 24,
                              backgroundColor: isDone && getStepStatus(idx + 1) === 'done' ? '#10b981' : '#e2e8f0',
                              my: 0.25,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ pb: isLast ? 0 : 2, pt: 0.1 }}>
                        <Typography
                          sx={{
                            fontWeight: isDone ? 700 : 500,
                            color: isDone ? '#0f172a' : '#94a3b8',
                            fontSize: '0.875rem',
                          }}
                        >
                          {step.label}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              {/* ─── รูปภาพตอนแจ้ง ─── */}
              <Box sx={{ mt: 3 }}>
                <Typography fontWeight={800} color="#0f172a" sx={{ fontSize: '0.925rem', mb: 1 }}>
                  รูปภาพตอนแจ้ง
                </Typography>
                {beforeImages.length > 0 ? (
                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    {beforeImages.map((img, i) => (
                      <Box
                        key={i}
                        component="img"
                        src={img}
                        alt={`รูปภาพตอนแจ้ง ${i + 1}`}
                        onClick={() => setLightboxSrc(img)}
                        sx={{
                          width: 68,
                          height: 68,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #e2e8f0',
                          cursor: 'pointer',
                          backgroundColor: '#f1f5f9',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          '&:hover': { transform: 'scale(1.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    ไม่มีภาพตอนแจ้ง
                  </Typography>
                )}
              </Box>

              {/* ─── รายละเอียดการซ่อม ─── */}
              <Box sx={{ mt: 2.75 }}>
                <Typography fontWeight={800} color="#0f172a" sx={{ fontSize: '0.925rem', mb: 0.5 }}>
                  รายละเอียดการซ่อม
                </Typography>
                <Typography variant="body2" color="#475569" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {result.repairResult || (result.status === 'completed' ? 'ดำเนินการซ่อมเรียบร้อยแล้ว' : 'อยู่ระหว่างดำเนินการซ่อม')}
                </Typography>
              </Box>

              {/* ─── รูปภาพหลังซ่อมเสร็จ ─── */}
              <Box sx={{ mt: 2.75 }}>
                <Typography fontWeight={800} color="#0f172a" sx={{ fontSize: '0.925rem', mb: 1 }}>
                  รูปภาพหลังซ่อมเสร็จ
                </Typography>
                {afterImages.length > 0 ? (
                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    {afterImages.map((img, i) => (
                      <Box
                        key={i}
                        component="img"
                        src={img}
                        alt={`รูปภาพหลังซ่อมเสร็จ ${i + 1}`}
                        onClick={() => setLightboxSrc(img)}
                        sx={{
                          width: 68,
                          height: 68,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #e2e8f0',
                          cursor: 'pointer',
                          backgroundColor: '#f1f5f9',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          '&:hover': { transform: 'scale(1.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                        }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {result.status === 'completed' ? 'ไม่มีภาพหลังซ่อมเสร็จ' : 'ยังไม่มีภาพหลังการซ่อม'}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>

      {/* ─── Lightbox Modal สำหรับดูรูปขนาดใหญ่ ─── */}
      {lightboxSrc && (
        <Dialog
          open
          onClose={() => setLightboxSrc(null)}
          maxWidth={false}
          PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none', m: 1.5 } }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setLightboxSrc(null)}
              size="small"
              sx={{
                position: 'absolute', top: -14, right: -14, zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffffff',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.95)' },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
            <Box
              component="img"
              src={lightboxSrc}
              alt="รูปภาพขนาดใหญ่"
              sx={{
                maxWidth: { xs: '92vw', sm: '80vw', md: '70vw' },
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '12px',
                display: 'block',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            />
          </Box>
        </Dialog>
      )}
    </Box>
  )
}