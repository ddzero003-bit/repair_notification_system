import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Typography, Stack, Button, Grid, Chip } from '@mui/material'
import StatCard from '../../components/common/StatCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { repairService } from '../../services/repairService.js'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants.js'
import dayjs from 'dayjs'

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    repairService.list({ technicianId: user.id }).then(setJobs)
  }, [user.id])

  const counts = jobs
    ? {
        assigned: jobs.filter((j) => j.status === 'assigned').length,
        inProgress: jobs.filter((j) => j.status === 'in_progress').length,
        completed: jobs.filter((j) => j.status === 'completed').length,
      }
    : { assigned: 0, inProgress: 0, completed: 0 }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              ช่าง{user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              งานซ่อมที่ได้รับมอบหมาย · กองช่าง ทต.สงเปลือย
            </Typography>
          </Box>
          <Chip
            size="small"
            label={user.specialty ? `ช่าง${user.specialty}` : 'ช่างประจำการ'}
            sx={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600 }}
          />
        </Stack>
      </Box>

      {/* 3 Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="งานใหม่ที่ได้รับ"
            value={counts.assigned}
            subtext="รอดำเนินการลงพื้นที่"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="กำลังดำเนินการ"
            value={counts.inProgress}
            subtext="อยู่ระหว่างการซ่อมแซม"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="เสร็จสิ้นแล้ว"
            value={counts.completed}
            subtext="ปิดงานเรียบร้อย"
          />
        </Grid>
      </Grid>

      {/* Jobs List */}
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
            รายการงานซ่อมของฉัน
          </Typography>
          <Button
            component={Link}
            to="/technician/jobs"
            size="small"
            sx={{ fontWeight: 600, color: '#1b3752' }}
          >
            ดูทั้งหมด ({jobs?.length || 0})
          </Button>
        </Box>

        {jobs === null ? (
          <Spinner />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="ยังไม่มีงานที่ได้รับมอบหมาย"
            description="เมื่อหัวหน้าช่างมอบหมายงาน รายการจะปรากฏที่นี่"
          />
        ) : (
          jobs.slice(0, 6).map((j, idx) => {
            const cat = REPAIR_CATEGORIES.find((c) => c.value === j.category)
            const priority = PRIORITY_LEVELS.find((p) => p.value === j.priority)

            return (
              <Box
                key={j.id}
                onClick={() => navigate(`/technician/jobs/${j.id}`)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                  borderBottom: idx !== jobs.length - 1 ? '1px solid #f1f5f9' : 'none',
                  '&:hover': { backgroundColor: '#f8fafc' },
                }}
              >
                <Box sx={{ pr: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {j.id}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#0f172a">
                      {j.title}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    {cat?.label || 'ทั่วไป'} · 📍 {j.location || '-'} · {dayjs(j.createdAt).format('D MMM YYYY HH:mm')}
                  </Typography>
                </Box>
                <StatusBadge status={j.status} size="small" />
              </Box>
            )
          })
        )}
      </Box>
    </Box>
  )
}
