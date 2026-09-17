import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, MenuItem, TextField,
} from '@mui/material'
import dayjs from 'dayjs'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES, REPAIR_STATUSES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'

export default function RepairRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    repairService
      .list({ status: statusFilter || undefined, category: categoryFilter || undefined })
      .then(setRequests)
  }, [statusFilter, categoryFilter])

  const columns = [
    {
      key: 'id',
      label: 'หมายเลขคำขอ',
      sortable: true,
      render: (r) => (
        <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>
          {r.id}
        </Typography>
      ),
    },
    {
      key: 'title',
      label: 'หัวข้อปัญหา',
      sortable: true,
      render: (r) => (
        <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem' }}>
          {r.title}
        </Typography>
      ),
    },
    {
      key: 'category',
      label: 'ประเภท',
      render: (r) => {
        const cat = REPAIR_CATEGORIES.find((c) => c.value === r.category)
        return (
          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
            {cat?.label || 'ทั่วไป'}
          </Typography>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'วันที่แจ้ง',
      sortable: true,
      render: (r) => (
        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
          {dayjs(r.createdAt).format('D MMM YYYY HH:mm')}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'สถานะ',
      render: (r) => <StatusBadge status={r.status} size="small" />,
    },
  ]

  return (
    <Box>
      {/* Header Bar */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.35rem' }}>
          รายการคำขอแจ้งซ่อม
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          ตรวจสอบและมอบหมายงานให้ช่างเทคนิค
        </Typography>
      </Box>

      {/* Filter Row */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <TextField
          select
          size="small"
          label="สถานะ:"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            minWidth: 160,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#ffffff' },
          }}
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value="">ทั้งหมด</MenuItem>
          {REPAIR_STATUSES.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="ประเภทปัญหา:"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{
            minWidth: 160,
            '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#ffffff' },
          }}
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value="">ทั้งหมด</MenuItem>
          {REPAIR_CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Main Table */}
      {!requests ? (
        <Spinner />
      ) : (
        <DataTable
          columns={columns}
          rows={requests}
          searchPlaceholder="ค้นหาด้วยหมายเลขคำขอหรือหัวข้อ"
          searchKeys={['id', 'title', 'location', 'category']}
          onRowClick={(r) => navigate(`/operator/requests/${r.id}`)}
        />
      )}
    </Box>
  )
}
