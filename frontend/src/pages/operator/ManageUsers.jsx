import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Stack, IconButton, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import DataTable from '../../components/common/DataTable.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import apiClient from '../../services/apiClient.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

const roleConfig = {
  operator: {
    label: 'หัวหน้าช่าง',
    bg: '#eff6ff',
    color: '#2563eb',
    border: '#dbeafe',
    avatarBg: '#2563eb',
  },
  technician: {
    label: 'ช่างซ่อม',
    bg: '#fffbeb',
    color: '#d97706',
    border: '#fef3c7',
    avatarBg: '#d97706',
  },
  citizen: {
    label: 'ประชาชน',
    bg: '#f5f3ff',
    color: '#7c3aed',
    border: '#ede9fe',
    avatarBg: '#7c3aed',
  },
}

const emptyForm = { name: '', username: '', phone: '', email: '', password: '', role: 'technician', specialty: '' }

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { notify } = useNotifications()
  const navigate = useNavigate()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadUsers = async () => {
    try {
      const { data } = await apiClient.get('/users')
      setUsers(data)
    } catch (err) {
      notify('ไม่สามารถโหลดข้อมูลผู้ใช้ได้', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleOpenAdd = () => {
    setEditUser(null)
    setForm(emptyForm)
    setError('')
    setDialogOpen(true)
  }

  const handleOpenEdit = (user) => {
    setEditUser(user)
    setForm({
      name: user.name || '',
      username: user.username || '',
      phone: user.phone || '',
      email: user.email || '',
      password: '',
      role: user.role,
      specialty: user.specialty || '',
    })
    setError('')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name) return setError('กรุณากรอกชื่อ-นามสกุล')
    if (!editUser && !form.username) return setError('กรุณากรอกชื่อผู้ใช้')
    if (!editUser && !form.password) return setError('กรุณากรอกรหัสผ่าน')
    if (!editUser && form.password.length < 6) return setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')

    setSaving(true)
    setError('')
    try {
      if (editUser) {
        await apiClient.put(`/users/${editUser.role}/${editUser.id}`, form)
        notify('แก้ไขข้อมูลผู้ใช้สำเร็จ ✅')
      } else {
        await apiClient.post('/users', form)
        notify('เพิ่มผู้ใช้ใหม่สำเร็จ ✅')
      }
      setDialogOpen(false)
      loadUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/users/${deleteTarget.role}/${deleteTarget.id}`)
      notify('ลบผู้ใช้เรียบร้อยแล้ว')
      setDeleteTarget(null)
      loadUsers()
    } catch (err) {
      notify('ไม่สามารถลบผู้ใช้ได้', 'error')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'ชื่อผู้ใช้',
      sortable: true,
      render: (u) => {
        const conf = roleConfig[u.role] || roleConfig.citizen
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 34, height: 34, bgcolor: conf.avatarBg, fontSize: 13, fontWeight: 700 }}>
              {u.name?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', lineHeight: 1.2 }}>
                {u.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                @{u.username || '-'}
              </Typography>
            </Box>
          </Stack>
        )
      },
    },
    {
      key: 'role',
      label: 'บทบาท',
      sortable: true,
      render: (u) => {
        const conf = roleConfig[u.role] || { label: u.role, bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }
        return (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.25,
              py: 0.35,
              borderRadius: '16px',
              backgroundColor: conf.bg,
              border: `1px solid ${conf.border}`,
              color: conf.color,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            {conf.label}
          </Box>
        )
      },
    },
    {
      key: 'specialty',
      label: 'ความชำนาญ',
      sortable: true,
      render: (u) => {
        if (u.role !== 'technician' || !u.specialty) {
          return (
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              -
            </Typography>
          )
        }
        const isWater = u.specialty.includes('ประปา')
        const isElectric = u.specialty.includes('ไฟฟ้า')
        return (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.25,
              py: 0.35,
              borderRadius: '16px',
              backgroundColor: isWater ? '#f0f9ff' : isElectric ? '#fefce8' : '#f8fafc',
              border: `1px solid ${isWater ? '#bae6fd' : isElectric ? '#fef08a' : '#e2e8f0'}`,
              color: isWater ? '#0284c7' : isElectric ? '#a16207' : '#475569',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            {u.specialty}
          </Box>
        )
      },
    },
    {
      key: 'email',
      label: 'อีเมล',
      render: (u) => (
        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
          {u.email || '-'}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'สถานะ',
      render: () => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.25,
            py: 0.35,
            borderRadius: '16px',
            backgroundColor: '#f0fdf4',
            color: '#16a34a',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          ใช้งาน
        </Box>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (u) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => navigate(`/operator/broadcast?targetType=individual&targetRole=${u.role}&targetUserId=${u.id}`)}
            title="ส่งแจ้งเตือนผ่าน LINE"
            sx={{ color: '#2563eb' }}
          >
            <NotificationsActiveRoundedIcon fontSize="small" sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => handleOpenEdit(u)} title="แก้ไข" sx={{ color: '#64748b' }}>
            <EditRoundedIcon fontSize="small" sx={{ fontSize: 18 }} />
          </IconButton>
          {u.role !== 'citizen' && (
            <IconButton size="small" onClick={() => setDeleteTarget(u)} title="ลบ" sx={{ color: '#64748b' }}>
              <DeleteRoundedIcon fontSize="small" sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Stack>
      ),
    },
  ]

  if (loading) return <Spinner />

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ fontSize: '1.35rem' }}>
            จัดการผู้ใช้งาน
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            รายชื่อผู้ใช้จริงในระบบ (ประชาชน/หัวหน้าช่าง/ช่างซ่อม)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddRoundedIcon />}
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: '#2563eb',
            fontWeight: 700,
            borderRadius: '8px',
            px: 2,
            py: 0.85,
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
          }}
        >
          เพิ่มผู้ใช้
        </Button>
      </Stack>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={users}
        searchKeys={['name', 'username', 'email', 'phone', 'specialty']}
        searchPlaceholder="ค้นหาผู้ใช้..."
      />

      {/* Dialog: เพิ่ม/แก้ไขผู้ใช้ */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', py: 2, px: 3, borderBottom: '1px solid #f1f5f9' }}>
          {editUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '24px !important' }}>
          <Stack spacing={2.5}>
            {error && <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>}

            {/* 1. บทบาท */}
            {!editUser && (
              <TextField
                select
                fullWidth
                label="บทบาท"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              >
                <MenuItem value="technician">ช่างซ่อม</MenuItem>
                <MenuItem value="operator">หัวหน้าช่าง</MenuItem>
              </TextField>
            )}

            {/* 2. ชื่อผู้ใช้ (username) * */}
            {!editUser && (
              <TextField
                fullWidth
                label="ชื่อผู้ใช้ (username) *"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              />
            )}

            {/* 3. รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) * */}
            {!editUser && (
              <TextField
                fullWidth
                type="password"
                label="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) *"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              />
            )}

            {/* 4. ชื่อ-นามสกุล * */}
            <TextField
              fullWidth
              label="ชื่อ-นามสกุล *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              }}
            />

            {/* 5. เบอร์โทรศัพท์ */}
            <TextField
              fullWidth
              label="เบอร์โทรศัพท์"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              }}
            />

            {/* 6. อีเมล */}
            <TextField
              fullWidth
              type="email"
              label="อีเมล"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              }}
            />

            {/* 7. ความชำนาญ (ถ้าเป็นช่างซ่อม) */}
            {form.role === 'technician' && (
              <TextField
                select
                fullWidth
                label="ความชำนาญ"
                value={form.specialty || ''}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              >
                <MenuItem value="">-- เลือกความชำนาญ --</MenuItem>
                <MenuItem value="ไฟฟ้า">ไฟฟ้า</MenuItem>
                <MenuItem value="ประปา">ประปา</MenuItem>
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f1f5f9' }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: '#2563eb',
              fontWeight: 600,
              fontSize: '0.875rem',
              mr: 1,
              '&:hover': { backgroundColor: '#eff6ff' },
            }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              backgroundColor: '#2563eb',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 3.5,
              py: 0.9,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
            }}
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: ยืนยันการลบ */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>ยืนยันการลบผู้ใช้</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ <b>{deleteTarget?.name}</b>? การกระทำนี้ไม่สามารถย้อนกลับได้
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: '#64748b' }}>
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ borderRadius: '8px' }}
          >
            ลบผู้ใช้
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
