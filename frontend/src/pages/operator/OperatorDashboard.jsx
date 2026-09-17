import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Stack } from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { repairService } from '../../services/repairService.js'
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
        <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.35rem' }}>
          แดชบอร์ดผู้ดูแลงานซ่อม
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          ภาพรวมงานแจ้งซ่อมสาธารณูปโภคทั้งหมด
        </Typography>
      </Box>

      {!stats ? (
        <Spinner />
      ) : (
        <>
          {/* 4 Metric Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="รอดำเนินการ"
                value={stats.pending}
                icon={<AssignmentOutlinedIcon sx={{ fontSize: 20 }} />}
                iconBg="#fffbeb"
                iconColor="#d97706"
                iconBorder="#fef3c7"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="กำลังดำเนินการ"
                value={stats.inProgress}
                icon={<BuildRoundedIcon sx={{ fontSize: 19 }} />}
                iconBg="#eff6ff"
                iconColor="#2563eb"
                iconBorder="#dbeafe"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="เสร็จสิ้นแล้ว"
                value={stats.completed}
                icon={<CheckRoundedIcon sx={{ fontSize: 22 }} />}
                iconBg="#f0fdf4"
                iconColor="#16a34a"
                iconBorder="#dcfce7"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="ยกเลิก"
                value={stats.cancelled}
                icon={<CloseRoundedIcon sx={{ fontSize: 20 }} />}
                iconBg="#fef2f2"
                iconColor="#dc2626"
                iconBorder="#fee2e2"
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Monthly Trend */}
            <Grid item xs={12} md={7}>
              <Box
                className="card"
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ mb: 2 }}>
                  งานแจ้งซ่อมรายเดือน
                </Typography>
                <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ height: 160, pt: 2, px: 2 }}>
                  {stats.monthlyTrend.map((m) => {
                    const heightPercent = (m.count / maxMonth) * 100
                    return (
                      <Stack key={m.month} alignItems="center" spacing={1} sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>
                          {m.count}
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            maxWidth: 36,
                            borderRadius: '4px 4px 0 0',
                            backgroundColor: '#2563eb',
                            height: `${Math.max(heightPercent, 8)}%`,
                            transition: 'height 0.3s ease',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {m.month}
                        </Typography>
                      </Stack>
                    )
                  })}
                </Stack>
              </Box>
            </Grid>

            {/* Category Breakdown */}
            <Grid item xs={12} md={5}>
              <Box
                className="card"
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ mb: 3 }}>
                  ประเภทปัญหาที่พบบ่อย
                </Typography>
                <Stack spacing={2.5}>
                  {stats.byCategory.map((cat) => {
                    const barPercent = (cat.count / maxCat) * 100
                    return (
                      <Box key={cat.category}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                            {cat.category}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                            {cat.count}
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            width: '100%',
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#f1f5f9',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#2563eb',
                              width: `${Math.max(barPercent, 4)}%`,
                              transition: 'width 0.3s ease',
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

          {/* Recent Requests Section */}
          <Box
            className="card"
            sx={{
              p: 3,
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #f1f5f9',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ mb: 2 }}>
              รายการแจ้งซ่อมล่าสุด
            </Typography>

            {!recent || recent.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                ยังไม่มีข้อมูลการแจ้งซ่อม
              </Typography>
            ) : (
              <Stack divider={<Box sx={{ borderBottom: '1px solid #f8fafc' }} />}>
                {recent.map((item) => (
                  <Box
                    key={item.id}
                    onClick={() => navigate(`/operator/requests/${item.id}`)}
                    sx={{
                      py: 1.75,
                      px: 1,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                      '&:hover': { backgroundColor: '#f8fafc' },
                    }}
                  >
                    <Box sx={{ minWidth: 0, mr: 2 }}>
                      <Typography variant="body2" fontWeight={700} color="#0f172a" noWrap>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="#64748b" sx={{ mt: 0.25, display: 'block' }}>
                        {item.id} · {dayjs(item.createdAt).format('D MMM YYYY HH:mm')}
                      </Typography>
                    </Box>
                    <Box sx={{ flexShrink: 0 }}>
                      <StatusBadge status={item.status} size="small" />
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
