import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, MenuItem, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, CircularProgress,
} from '@mui/material'
import dayjs from 'dayjs'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import apiClient from '../../services/apiClient.js'

export default function RepairRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // ===== สร้างลิงก์แจ้งซ่อม =====
  const [linkOpen, setLinkOpen] = useState(false)
  const [reportUrl, setReportUrl] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCreateLink = async () => {
    setLinkLoading(true)
    setLinkOpen(true)
    try {
      const res = await apiClient.get('/public/token')
      setReportUrl(res.data.reportUrl)
    } catch {
      setReportUrl('')
    } finally {
      setLinkLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reportUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    repairService
      .list({ status: statusFilter || undefined, category: categoryFilter || undefined })
      .then(setRequests)
  }, [statusFilter, categoryFilter])

  const columns = [
    {
      key: 'id',
      label: 'รหัสคำขอ',
      sortable: true,
      render: (r) => (
        <Typography variant="body2" fontWeight={600} color="#0f172a">
          {r.id}
        </Typography>
      ),
    },
    {
      key: 'title',
      label: 'หัวข้อปัญหาและสถานที่',
      sortable: true,
      render: (r) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color="#0f172a">
            {r.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {r.location || '-'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'category',
      label: 'ประเภท',
      render: (r) => {
        const cat = REPAIR_CATEGORIES.find((c) => c.value === r.category)
        return (
          <Typography variant="body2" color="text.secondary">
            {cat?.label || 'ทั่วไป'}
          </Typography>
        )
      },
    },
    {
      key: 'reporter',
      label: 'ผู้แจ้ง',
      render: (r) => (
        <Typography variant="body2" color="text.secondary">
          {r.reporterName || 'ไม่ระบุ'}
        </Typography>
      ),
    },
    {
      key: 'createdAt',
      label: 'วันที่แจ้ง',
      sortable: true,
      render: (r) => dayjs(r.createdAt).format('D MMM YYYY HH:mm'),
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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#0f172a">
            รายการคำขอแจ้งซ่อม
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ตรวจสอบข้อมูลและมอบหมายงานให้ช่างซ่อมภาคสนาม
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<LinkRoundedIcon />}
          onClick={handleCreateLink}
          sx={{
            backgroundColor: '#1b3752',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#112234' },
          }}
        >
          สร้างลิงก์แจ้งซ่อม
        </Button>
      </Stack>

      {/* Filter Row */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <TextField
          select
          size="small"
          label="ประเภทปัญหา"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 160, backgroundColor: '#ffffff' }}
        >
          <MenuItem value="">ทุกประเภท</MenuItem>
          {REPAIR_CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="สถานะงาน"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 160, backgroundColor: '#ffffff' }}
        >
          <MenuItem value="">ทุกสถานะ</MenuItem>
          <MenuItem value="reported">แจ้งแล้ว</MenuItem>
          <MenuItem value="assigned">มอบหมายแล้ว</MenuItem>
          <MenuItem value="in_progress">กำลังดำเนินการ</MenuItem>
          <MenuItem value="completed">เสร็จสิ้น</MenuItem>
          <MenuItem value="rejected">ช่างปฏิเสธ</MenuItem>
          <MenuItem value="cancelled">ยกเลิก</MenuItem>
        </TextField>
      </Stack>

      {/* Data Table */}
      {requests === null ? (
        <Spinner />
      ) : (
        <DataTable
          columns={columns}
          rows={requests}
          searchKeys={['id', 'title', 'location']}
          searchPlaceholder="ค้นหาด้วยรหัส, หัวข้อ, หรือสถานที่..."
          onRowClick={(row) => navigate(`/operator/requests/${row.id}`)}
        />
      )}

      {/* Modal: สร้างลิงก์แจ้งซ่อม */}
      <Dialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '8px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#0f172a' }}>
          ลิงก์แจ้งซ่อมสำหรับประชาชน
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ส่งลิงก์นี้ให้ผู้แจ้งซ่อม ลิงก์มีอายุ <strong>48 ชั่วโมง</strong> สามารถเปิดกรอกได้โดยไม่ต้องลงชื่อเข้าใช้
          </Typography>

          {linkLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={28} sx={{ color: '#1b3752' }} />
            </Box>
          ) : reportUrl ? (
            <>
              <Alert
                severity="success"
                sx={{
                  borderRadius: '6px',
                  mb: 2,
                  wordBreak: 'break-all',
                  fontSize: '0.85rem',
                }}
              >
                {reportUrl}
              </Alert>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ContentCopyRoundedIcon />}
                onClick={handleCopyLink}
                sx={{
                  backgroundColor: copied ? '#15803d' : '#1b3752',
                  fontWeight: 600,
                  py: 1,
                  '&:hover': { backgroundColor: copied ? '#166534' : '#112234' },
                }}
              >
                {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกลิงก์'}
              </Button>
            </>
          ) : (
            <Alert severity="error" sx={{ borderRadius: '6px' }}>
              ไม่สามารถสร้างลิงก์ได้ กรุณาลองใหม่อีกครั้ง
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setLinkOpen(false)
              setReportUrl('')
              setCopied(false)
            }}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
