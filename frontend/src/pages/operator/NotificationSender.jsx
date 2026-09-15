import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, TextField, MenuItem, Alert, Chip, IconButton,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material'
import api from '../../services/apiClient.js'
import { uploadImages } from '../../services/uploadService.js'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import dayjs from 'dayjs'

const targetLabel = {
  all_users: 'ประชาชนทั้งหมด',
  all_technicians: 'ช่างซ่อมทั้งหมด',
  individual: 'บุคคล',
}

export default function NotificationSender() {
  const [searchParams] = useSearchParams()
  const [targetType, setTargetType] = useState(searchParams.get('targetType') || 'all_users')
  const [targetRole, setTargetRole] = useState(searchParams.get('targetRole') || 'citizen')
  const [targetUserId, setTargetUserId] = useState(searchParams.get('targetUserId') || '')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.get('/admin/notifications')
      setHistory(res.data.data)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage({ file, preview: URL.createObjectURL(file) })
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() && !image) {
      setError('กรุณาระบุข้อความหรือรูปภาพอย่างน้อย 1 อย่าง')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      let imageUrl = null
      if (image) {
        const urls = await uploadImages([image.file])
        imageUrl = urls[0]
      }

      const payload = { targetType, message: message.trim(), imageUrl }
      if (targetType === 'individual') {
        payload.targetUserId = targetUserId
        payload.targetRole = targetRole
      }

      const res = await api.post('/admin/notifications', payload)
      setSuccessMsg(`ส่งแจ้งเตือนสำเร็จ: ${res.data.summary.success} รายการ, ล้มเหลว: ${res.data.summary.failed} รายการ`)
      setMessage('')
      setImage(null)
      fetchHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งแจ้งเตือน')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <NotificationsRoundedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography variant="h5">
            ระบบแจ้งเตือน (LINE Broadcast)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ส่งข้อความประชาสัมพันธ์หรือแจ้งเตือนผ่าน LINE OA ถึงผู้ใช้ในระบบ
          </Typography>
        </Box>
      </Stack>

      <Box className="card" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ส่งข้อความแจ้งเตือนใหม่
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg(null)}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 672 }}>
          <TextField
            select
            fullWidth
            label="กลุ่มเป้าหมาย"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="all_users">ประชาชน (Citizen) ทั้งหมด</MenuItem>
            <MenuItem value="all_technicians">ช่างซ่อม (Technician) ทั้งหมด</MenuItem>
            <MenuItem value="individual">ระบุรายบุคคล</MenuItem>
          </TextField>

          {targetType === 'individual' && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                select
                fullWidth
                label="ประเภทบัญชี"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <MenuItem value="citizen">ประชาชน (Citizen)</MenuItem>
                <MenuItem value="technician">ช่างซ่อม (Technician)</MenuItem>
                <MenuItem value="operator">เจ้าหน้าที่ (Operator)</MenuItem>
              </TextField>
              <TextField
                fullWidth
                type="number"
                required
                label="รหัสผู้ใช้งาน (ID)"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="เช่น 1, 2, 3"
              />
            </Stack>
          )}

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="ข้อความแจ้งเตือน"
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="พิมพ์ข้อความที่ต้องการแจ้งเตือน (สูงสุด 2000 ตัวอักษร)"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
              {message.length} / 2000
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
              แนบรูปภาพประกอบ (เลือกได้ 1 รูป)
            </Typography>
            {image ? (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box
                  component="img"
                  src={image.preview}
                  alt="preview"
                  sx={{ width: 128, height: 128, objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <IconButton
                  type="button"
                  onClick={handleRemoveImage}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    '&:hover': { bgcolor: 'error.dark' },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ) : (
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 128,
                  height: 128,
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, border-color 0.15s ease',
                  '&:hover': { backgroundColor: '#f8fafc', borderColor: '#94a3b8' },
                }}
              >
                <PhotoCameraRoundedIcon sx={{ fontSize: 24, color: '#64748b' }} />
                <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 600, color: '#64748b' }}>
                  + เพิ่มรูปภาพ
                </Typography>
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<SendRoundedIcon />}
          >
            {loading ? 'กำลังส่ง...' : 'ส่งแจ้งเตือน'}
          </Button>
        </Box>
      </Box>

      <Box className="card">
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
          <Typography fontWeight={700}>ประวัติการส่งแจ้งเตือน</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>วันที่ส่ง</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>กลุ่มเป้าหมาย</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ข้อความ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>สถานะ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {dayjs(log.sent_at).format('D MMM YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    {log.target_type === 'individual'
                      ? `บุคคล (${log.target_role} ID: ${log.target_user_id})`
                      : targetLabel[log.target_type]}
                  </TableCell>
                  <TableCell
                    sx={{ maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={log.message}
                  >
                    {log.message}
                  </TableCell>
                  <TableCell>
                    {log.status === 'success' ? (
                      <Chip size="small" label="สำเร็จ" sx={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }} />
                    ) : (
                      <Chip size="small" label="ล้มเหลว" title={log.error_detail} sx={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    ยังไม่มีประวัติการส่งแจ้งเตือน
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
