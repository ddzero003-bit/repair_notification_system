import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { repairService } from '../../services/repairService.js'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import dayjs from 'dayjs'

export default function OperatorDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState(null)

  useEffect(() => {
    repairService.getStats().then(setStats)
    repairService.list().then((data) => setRecent(data.slice(0, 6)))
  }, [])

  const maxCat = stats ? Math.max(...stats.byCategory.map((c) => c.count), 1) : 1
  const maxMonth = stats ? Math.max(...stats.monthlyTrend.map((m) => m.count), 1) : 1

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              ภาพรวมงานแจ้งซ่อมสาธารณูปโภค
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ศูนย์สั่งการและมอบหมายงาน กองช่าง เทศบาลตำบลสงเปลือย
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate('/operator/requests')}
            sx={{ backgroundColor: '#1b3752', fontWeight: 600 }}
          >
            ดูคิวงานทั้งหมด
          </Button>
        </Stack>
      </Box>

      {!stats ? (
        <Spinner />
      ) : (
        <>
          {/* 4 Metric Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="รอมอบหมายงาน"
                value={stats.pending}
                subtext="คำขอใหม่ที่ยังไม่ได้สั่งการ"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="กำลังดำเนินการ"
                value={stats.inProgress}
                subtext="ช่างอยู่ระหว่างลงพื้นที่"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="เสร็จสิ้นแล้ว"
                value={stats.completed}
                subtext="งานที่ดำเนินการซ่อมเสร็จสมบูรณ์"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="ยกเลิก / ปฏิเสธ"
                value={stats.cancelled}
                subtext="คำขอยกเลิกหรือช่างปฏิเสธ"
              />
            </Grid>
          </Grid>

          {/* Charts & Distribution */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Monthly Trend */}
            <Grid item xs={12} md={7}>
              <Box className="card" sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ mb: 2 }}>
                  ปริมาณงานแจ้งซ่อมรายเดือน
                </Typography>
                <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ height: 160, pt: 2 }}>
                  {stats.monthlyTrend.map((m) => {
                    const heightPercent = (m.count / maxMonth) * 100
                    return (
                      <Stack key={m.month} alignItems="center" spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                          {m.count}
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            maxWidth: 32,
                            borderRadius: '4px 4px 0 0',
                            backgroundColor: '#1b3752',
                            height: `${Math.max(heightPercent, 8)}%`,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {m.month}
                        </Typography>
                      </Stack>
                    )
                  })}
                </Stack>
              </Box>
            </Grid>

            {/* By Category */}
            <Grid item xs={12} md={5}>
              <Box className="card" sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ mb: 2 }}>
                  สัดส่วนประเภทงานซ่อม
                </Typography>
                <Stack spacing={2}>
                  {stats.byCategory.map((c) => {
                    const catObj = REPAIR_CATEGORIES.find((cat) => cat.value === c.category)
                    const labelText = catObj ? catObj.label : c.category === 'electricity' ? 'ไฟฟ้าสาธารณะ' : c.category === 'water' ? 'ประปาหมู่บ้าน' : c.category
                    const barPercent = (c.count / maxCat) * 100

                    return (
                      <Box key={c.category}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600} color="#1e293b">
                            {labelText}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#64748b">
                            {c.count} รายการ
                          </Typography>
                        </Stack>
                        <Box sx={{ height: 6, borderRadius: 3, backgroundColor: '#f1f5f9' }}>
                          <Box
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#1b3752',
                              width: `${Math.max(barPercent, 6)}%`,
                            }}
                          />
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      {/* Recent Requests Table List */}
      <Box className="card">
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
            รายการแจ้งซ่อมล่าสุด
          </Typography>
          <Button
            size="small"
            onClick={() => navigate('/operator/requests')}
            sx={{ fontWeight: 600, color: '#1b3752' }}
          >
            ดูทั้งหมด
          </Button>
        </Box>

        {recent === null ? (
          <Spinner />
        ) : (
          recent.map((r, idx) => {
            const cat = REPAIR_CATEGORIES.find((c) => c.value === r.category)

            return (
              <Box
                key={r.id}
                onClick={() => navigate(`/operator/requests/${r.id}`)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                  borderBottom: idx !== recent.length - 1 ? '1px solid #f1f5f9' : 'none',
                  '&:hover': { backgroundColor: '#f8fafc' },
                }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {r.id}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#0f172a">
                      {r.title}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {cat?.label || 'ทั่วไป'} · 📍 {r.location || '-'} · {dayjs(r.createdAt).format('D MMM YYYY HH:mm')}
                  </Typography>
                </Box>
                <StatusBadge status={r.status} size="small" />
              </Box>
            )
          })
        )}
      </Box>
    </Box>
  )
}
