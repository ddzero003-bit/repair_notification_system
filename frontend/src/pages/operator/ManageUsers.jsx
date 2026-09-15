import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Chip, Stack, IconButton, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/common/DataTable.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import apiClient from '../../services/apiClient.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

const roleLabel = { citizen: 'ประชาชน', operator: 'หัวหน้าช่าง', technician: 'ช่างซ่อม' }
const roleBg = { citizen: '#e0f2fe', operator: '#f0f5fa', technician: '#fffbeb' }
const roleColor = { citizen: '#0369a1', operator: '#1b3752', technician: '#b45309' }

const emptyForm = { name: '', username: '', phone: '', email: '', password: '', role: 'technician', specialty: '' }

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { notify } = useNotifications()

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

  const handleToggleStatus = async (user) => {
    try {
      await apiClient.patch(`/users/${user.role}/${user.id}/toggle-status`)
      notify('อัปเดตสถานะผู้ใช้สำเร็จ')
      loadUsers()
    } catch (err) {
      notify('ไม่สามารถอัปเดตสถานะได้', 'error')
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

  const navigate = useNavigate()

  const columns = [
    {
      key: 'name',
      label: 'ชื่อ-นามสกุล / ชื่อผู้ใช้',
      sortable: true,
      render: (u) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 38, height: 38, bgcolor: roleColor[u.role] || '#1b3752', fontSize: 14, fontWeight: 700 }}>
            {u.name?.[0] || 'U'}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
              {u.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{u.username || '-'} {u.specialty ? `· ช่าง${u.specialty}` : ''}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      key: 'role',
      label: 'บทบาทหน้าที่',
      sortable: true,
      render: (u) => (
        <Chip
          size="small"
          label={roleLabel[u.role]}
          sx={{
            backgroundColor: roleBg[u.role] || '#f1f5f9',
            color: roleColor[u.role] || '#1b3752',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      key: 'phone',
      label: 'เบอร์โทรศัพท์',
      render: (u) => u.phone || '-',
    },
    {
      key: 'status',
      label: 'สถานะบัญชี',
      render: (u) =>
        u.role !== 'citizen' ? (
          <Chip
            size="small"
            label={u.status === 'active' ? '● เปิดใช้งาน' : '○ ปิดใช้งาน'}
            onClick={() => handleToggleStatus(u)}
            sx={{
              cursor: 'pointer',
              fontWeight: 600,
              backgroundColor: u.status === 'active' ? '#f0fdf4' : '#f1f5f9',
              color: u.status === 'active' ? '#15803d' : '#64748b',
              border: u.status === 'active' ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
            }}
          />
        ) : (
          <Chip size="small" label="เปิดใช้งาน" sx={{ backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 700 }} />
        ),
    },
    {
      key: 'actions',
      label: 'จัดการ',
      render: (u) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => navigate(`/operator/broadcast?targetType=individual&targetRole=${u.role}&targetUserId=${u.id}`)} title="ส่งแจ้งเตือนผ่าน LINE">
            <NotificationsActiveRoundedIcon fontSize="small" sx={{ color: 'info.main' }} />
          </IconButton>
          <IconButton size="small" onClick={() => handleOpenEdit(u)} title="แก้ไข">
            <EditRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} />
          </IconButton>
          {u.role !== 'citizen' && (
            <IconButton size="small" onClick={() => setDeleteTarget(u)} title="ลบ">
              <DeleteRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5">
            จัดการผู้ใช้งานและช่างซ่อม
          </Typography>
          <Typography variant="body2" color="text.secondary">
            เพิ่ม แก้ไข หรือระงับบัญชีผู้ใช้ในระบบเทศบาล ({users.length} บัญชี)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddRoundedIcon />}
          onClick={handleOpenAdd}
        >
          เพิ่มผู้ใช้ใหม่
        </Button>
      </Stack>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={users}
        searchKeys={['name', 'username', 'email', 'phone', 'specialty']}
        searchPlaceholder="ค้นหาตามชื่อ, ชื่อผู้ใช้, ความชำนาญ, เบอร์โทร..."
      />

      {/* Dialog: เพิ่ม/แก้ไขผู้ใช้ */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่เข้าสู่ระบบ'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            {!editUser && (
              <TextField
                select
                label="บทบาทหน้าที่ *"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <MenuItem value="operator">หัวหน้าช่าง / ศูนย์สั่งการ (Operator)</MenuItem>
                <MenuItem value="technician">ช่างซ่อมภาคสนาม (Technician)</MenuItem>
              </TextField>
            )}

            <TextField
              label="ชื่อ-นามสกุล *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="เช่น นายสมชาย ช่างทอง"
            />
            <TextField
              label="ชื่อผู้ใช้ (Username) *"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={!!editUser}
              placeholder="เช่น tech2"
              autoComplete="off"
            />
            <TextField
              label="เบอร์โทรศัพท์ติดต่อ"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="เช่น 0812345678"
            />
            <TextField
              label="อีเมล"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="off"
            />

            {(form.role === 'technician' || editUser?.role === 'technician') && (
              <TextField
                label="ความชำนาญสายงาน"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                placeholder="เช่น ไฟฟ้า, ประปา, ทั่วไป"
              />
            )}

            <TextField
              label={editUser ? 'รหัสผ่านใหม่ (เว้นว่างไว้หากไม่เปลี่ยน)' : 'รหัสผ่านเข้าสู่ระบบ *'}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)}>
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'กำลังบันทึก...' : editUser ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: ยืนยันลบ */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          ยืนยันการลบบัญชีผู้ใช้
        </DialogTitle>
        <DialogContent>
          <Typography>
            คุณต้องการลบ <b>{deleteTarget?.name}</b> ({roleLabel[deleteTarget?.role]}) ออกจากระบบใช่หรือไม่?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            การลบจะไม่สามารถกู้คืนข้อมูลได้
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteTarget(null)}>
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            ยืนยันลบ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
