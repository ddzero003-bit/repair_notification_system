import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Stack, Alert, InputAdornment, Chip, Divider } from '@mui/material'
import TagRoundedIcon from '@mui/icons-material/TagRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import RepairTimeline from '../../components/common/RepairTimeline.jsx'
import { repairService } from '../../services/repairService.js'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import dayjs from 'dayjs'

export default function CheckStatus() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('id') || ''

  const [code, setCode] = useState(initialId)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doSearch = async (searchCode) => {
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
  }

  useEffect(() => {
    if (initialId) {
      doSearch(initialId)
    }
  }, [initialId])

  const handleSearch = (e) => {
    e.preventDefault()
    doSearch(code)
  }

  const cat = REPAIR_CATEGORIES.find((c) => c.value === result?.category)

  return (
    <Box sx={{ py: { xs: 4, md: 7 } }}>
      <Container maxWidth="sm">
        <Box className="card" sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="#0f172a">
              ตรวจสอบสถานะคำขอแจ้งซ่อม
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              กรอกหมายเลขคำขอ (เช่น SR2569-001) เพื่อดูความคืบหน้า
            </Typography>
          </Box>

          {/* Search Form */}
          <Box component="form" onSubmit={handleSearch}>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เช่น SR2569-001"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TagRoundedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchRoundedIcon />}
                disabled={loading || !code.trim()}
                sx={{
                  backgroundColor: '#1b3752',
                  fontWeight: 600,
                  px: 2.5,
                  whiteSpace: 'nowrap',
                  '&:hover': { backgroundColor: '#112234' },
                }}
              >
                {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mt: 2.5, borderRadius: '6px', fontSize: '0.875rem' }}>
              {error}
            </Alert>
          )}

          {/* Case Detail Card */}
          {result && (
            <Box sx={{ mt: 3.5, pt: 3, borderTop: '1px solid #e2e8f0' }}>
              <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                      {result.id}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                      {result.title}
                    </Typography>
                  </Box>
                  <StatusBadge status={result.status} size="small" />
                </Stack>

                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <b>ประเภท:</b> {cat?.label || 'ทั่วไป'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>สถานที่:</b> {result.location || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>วันที่แจ้ง:</b> {dayjs(result.createdAt).format('D MMMM YYYY HH:mm น.')}
                  </Typography>
                </Stack>
              </Box>

              <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
                ขั้นตอนการดำเนินงาน:
              </Typography>
              <RepairTimeline status={result.status} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}