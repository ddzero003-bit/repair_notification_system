import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Chip, Stack, TextField, MenuItem } from '@mui/material'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function AssignedJobs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    repairService.list({ technicianId: user.id }).then(setJobs)
  }, [user.id])

  const filteredJobs = jobs?.filter((j) => (statusFilter ? j.status === statusFilter : true))

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#0f172a">
            งานที่ได้รับมอบหมาย
          </Typography>
          <Typography variant="body2" color="text.secondary">
            รายการงานซ่อมภาคสนามทั้งหมดที่คุณรับผิดชอบ
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          label="สถานะ"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150, backgroundColor: '#ffffff' }}
        >
          <MenuItem value="">ทุกสถานะ</MenuItem>
          <MenuItem value="assigned">มอบหมายแล้ว</MenuItem>
          <MenuItem value="in_progress">กำลังดำเนินการ</MenuItem>
          <MenuItem value="completed">เสร็จสิ้น</MenuItem>
          <MenuItem value="rejected">ปฏิเสธงาน</MenuItem>
        </TextField>
      </Stack>

      {jobs === null ? (
        <Spinner />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="ไม่พบรายการงานซ่อม"
          description="ไม่มีงานซ่อมที่ตรงกับตัวกรองที่เลือก"
        />
      ) : (
        <Grid container spacing={2}>
          {filteredJobs.map((j) => {
            const cat = REPAIR_CATEGORIES.find((c) => c.value === j.category)
            const priority = PRIORITY_LEVELS.find((p) => p.value === j.priority)

            return (
              <Grid item xs={12} sm={6} md={4} key={j.id}>
                <Box
                  className="card card-hover"
                  sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => navigate(`/technician/jobs/${j.id}`)}
                >
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {j.id}
                      </Typography>
                      <StatusBadge status={j.status} size="small" />
                    </Stack>

                    <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 0.5 }}>
                      {j.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      📍 {j.location || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={cat?.label || 'ทั่วไป'}
                        sx={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: '0.75rem' }}
                      />
                      {priority && (
                        <Chip
                          size="small"
                          label={priority.label}
                          sx={{
                            backgroundColor: priority.badgeBg || '#f1f5f9',
                            color: priority.badgeText || '#475569',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      {dayjs(j.createdAt).format('D MMM YYYY HH:mm')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
