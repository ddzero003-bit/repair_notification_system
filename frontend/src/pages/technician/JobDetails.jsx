import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Box, Typography, Grid, Chip, Button, Stack, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Divider, Alert,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CompareRoundedIcon from '@mui/icons-material/CompareRounded'
import dayjs from 'dayjs'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import RepairTimeline from '../../components/common/RepairTimeline.jsx'
import { Spinner } from '../../components/common/LoadingState.jsx'
import { REPAIR_CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants.js'
import { repairService } from '../../services/repairService.js'
import { uploadImages } from '../../services/uploadService.js'
import { useNotifications } from '../../contexts/NotificationContext.jsx'

const nextStatusMap = { assigned: 'in_progress', in_progress: 'completed' }
const nextStatusButtonLabel = { assigned: 'เริ่มลงพื้นที่ซ่อม', in_progress: 'บันทึกซ่อมเสร็จสมบูรณ์' }

export default function JobDetails() {
  const { id } = useParams()
  const { notify } = useNotifications()
  const [job, setJob] = useState(null)
  const [updating, setUpdating] = useState(false)

  // Dialog: ปฏิเสธงาน
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejecting, setRejecting] = useState(false)

  // Dialog: ยืนยันจบงาน
  const [completeOpen, setCompleteOpen] = useState(false)
  const [repairDetail, setRepairDetail] = useState('')
  const [afterImages, setAfterImages] = useState([])

  // Preview รูปขยาย
  const [previewSrc, setPreviewSrc] = useState(null)

  const load = () => repairService.getById(id).then(setJob)
  useEffect(() => { load() }, [id])

  const handleImages = (e) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))
    setAfterImages((prev) => [...prev, ...newImages].slice(0, 5))
  }

  // ปุ่มหลัก: ถ้า in_progress → เปิด Dialog ยืนยันจบงาน, ถ้า assigned → เริ่มงานเลย
  const handleActionButton = () => {
    const next = nextStatusMap[job.status]
    if (!next) return
    if (next === 'completed') {
      setCompleteOpen(true)
    } else {
      handleStartJob()
    }
  }

  // เริ่มลงพื้นที่ (assigned → in_progress) — ไม่ต้องกรอกข้อมูลเพิ่ม
  const handleStartJob = async () => {
    setUpdating(true)
    try {
      await repairService.updateStatus(id, 'in_progress', {})
      notify('เริ่มดำเนินการซ่อมแล้ว')
      load()
    } finally {
      setUpdating(false)
    }
  }

  // ยืนยันจบงาน (in_progress → completed) — ต้องมีรายละเอียด + รูป
  const handleCompleteJob = async () => {
    if (!repairDetail.trim() || afterImages.length === 0) return
    setUpdating(true)
    try {
      const imageUrls = await uploadImages(afterImages.map((img) => img.file))
      await repairService.updateStatus(id, 'completed', {
        repairResult: repairDetail.trim(),
        imagesAfter: imageUrls,
      })
      notify('ยืนยันงานซ่อมเสร็จสมบูรณ์แล้ว ✅')
      setCompleteOpen(false)
      setRepairDetail('')
      setAfterImages([])
      load()
    } catch (err) {
      const msg = err?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
      notify(msg, 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    setRejecting(true)
    try {
      await repairService.rejectAssignment(id, rejectReason.trim())
      notify('ปฏิเสธงานเรียบร้อยแล้ว — รอหัวหน้าช่างมอบหมายใหม่', 'info')
      setRejectOpen(false)
      setRejectReason('')
      load()
    } finally {
      setRejecting(false)
    }
  }

  if (!job) return <Spinner />

  const cat = REPAIR_CATEGORIES.find((c) => c.value === job.category)
  const priority = PRIORITY_LEVELS.find((p) => p.value === job.priority)
  const canComplete = repairDetail.trim().length > 0 && afterImages.length > 0

  return (
    <Box>
      <Button
        component={Link}
        to="/technician/jobs"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 2, color: '#475569', fontWeight: 500 }}
      >
        กลับไปรายการงาน
      </Button>

      <Grid container spacing={2.5}>
        {/* Left: Job Sheet */}
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {job.id}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#0f172a">
                  {job.title}
                </Typography>
              </Box>
              <StatusBadge status={job.status} />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                size="small"
                label={cat?.label || 'ทั่วไป'}
                sx={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600 }}
              />
              {priority && (
                <Chip
                  size="small"
                  label={`ระดับ: ${priority.label}`}
                  sx={{
                    backgroundColor: priority.badgeBg || '#f1f5f9',
                    color: priority.badgeText || '#475569',
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>

            {/* Quick Actions: Direct Call & GPS Navigation */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
              {job.contactPhone && (
                <Button
                  component="a"
                  href={`tel:${job.contactPhone}`}
                  variant="outlined"
                  startIcon={<PhoneRoundedIcon fontSize="small" />}
                  sx={{
                    flex: 1,
                    py: 1,
                    fontWeight: 600,
                    borderColor: '#cbd5e1',
                    color: '#15803d',
                  }}
                >
                  โทรหาผู้แจ้ง ({job.contactPhone})
                </Button>
              )}

              {job.coords && (
                <Button
                  component="a"
                  href={`https://www.google.com/maps?q=${job.coords.lat},${job.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<NavigationRoundedIcon fontSize="small" />}
                  sx={{
                    flex: 1,
                    py: 1,
                    fontWeight: 600,
                    borderColor: '#cbd5e1',
                    color: '#0284c7',
                  }}
                >
                  เปิด Google Maps นำทาง
                </Button>
              )}
            </Stack>

            {/* Problem Details */}
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', mb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                รายละเอียดปัญหา:
              </Typography>
              <Typography variant="body2" color="#1e293b" sx={{ mb: 2 }}>
                {job.description || job.problemDesc || 'ไม่มีรายละเอียดเพิ่มเติม'}
              </Typography>

              <Stack spacing={0.75} sx={{ mt: 2, borderTop: '1px dashed #cbd5e1', pt: 1.5 }}>
                <Typography variant="body2" color="#334155">
                  <b>สถานที่:</b> {job.location || job.locationName}
                </Typography>
                <Typography variant="body2" color="#334155">
                  <b>วันที่แจ้ง:</b> {dayjs(job.createdAt).format('D MMMM YYYY HH:mm น.')}
                </Typography>
                <Typography variant="body2" color="#334155">
                  <b>ชื่อผู้แจ้ง:</b> {job.reporterName || 'ไม่ระบุ'}
                </Typography>
                {job.contactPhone && (
                  <Typography variant="body2" color="#334155">
                    <b>เบอร์ติดต่อผู้แจ้ง:</b>{' '}
                    <a href={`tel:${job.contactPhone}`} style={{ color: '#1b3752', fontWeight: 600 }}>
                      {job.contactPhone}
                    </a>
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Before Photos */}
            {job.images?.length > 0 && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#0f172a" sx={{ mb: 1 }}>
                  รูปภาพก่อนซ่อม ({job.images.length} รูป)
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {job.images.map((src, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={src}
                      alt="รูปก่อนซ่อม"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '6px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: '1px solid #cbd5e1',
                        transition: 'transform 0.15s',
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                      onClick={() => setPreviewSrc(src)}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* ─── Section: ผลการซ่อมและเปรียบเทียบ Before/After (แสดงเมื่องานเสร็จ) ─── */}
            {job.status === 'completed' && (
              <Box
                sx={{
                  mt: 2,
                  p: 2.5,
                  border: '1.5px solid #bbf7d0',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                }}
              >
                {/* หัวข้อ */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 22 }} />
                  <Typography variant="subtitle1" fontWeight={700} color="#166534">
                    ผลการซ่อมและสรุปงาน
                  </Typography>
                </Stack>

                {/* รายละเอียดการซ่อม */}
                {job.repairResult && (
                  <Box
                    sx={{
                      p: 2,
                      mb: 2.5,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1fae5',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="caption" color="#15803d" fontWeight={700} display="block" sx={{ mb: 0.5 }}>
                      📋 รายละเอียดการซ่อม:
                    </Typography>
                    <Typography variant="body2" color="#1e293b" sx={{ lineHeight: 1.7 }}>
                      {job.repairResult}
                    </Typography>
                  </Box>
                )}

                {/* Before / After Comparison */}
                {(job.images?.length > 0 || job.imagesAfter?.length > 0) && (
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5 }}>
                      <CompareRoundedIcon sx={{ color: '#0284c7', fontSize: 18 }} />
                      <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                        เปรียบเทียบก่อน / หลังซ่อม
                      </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                      {/* ก่อนซ่อม */}
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          sx={{
                            display: 'block',
                            mb: 1,
                            px: 1.5,
                            py: 0.4,
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            borderRadius: '20px',
                            textAlign: 'center',
                            fontSize: '0.72rem',
                          }}
                        >
                          🔴 ก่อนซ่อม ({job.images?.length || 0} รูป)
                        </Typography>
                        {job.images?.length > 0 ? (
                          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                            {job.images.map((src, i) => (
                              <Box
                                key={i}
                                component="img"
                                src={src}
                                alt={`ก่อนซ่อม ${i + 1}`}
                                sx={{
                                  width: 90,
                                  height: 90,
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '2px solid #fca5a5',
                                  cursor: 'pointer',
                                  transition: 'transform 0.15s',
                                  '&:hover': { transform: 'scale(1.05)' },
                                }}
                                onClick={() => setPreviewSrc(src)}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.secondary">ไม่มีรูปก่อนซ่อม</Typography>
                        )}
                      </Grid>

                      {/* หลังซ่อม */}
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          sx={{
                            display: 'block',
                            mb: 1,
                            px: 1.5,
                            py: 0.4,
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            borderRadius: '20px',
                            textAlign: 'center',
                            fontSize: '0.72rem',
                          }}
                        >
                          🟢 หลังซ่อม ({job.imagesAfter?.length || 0} รูป)
                        </Typography>
                        {job.imagesAfter?.length > 0 ? (
                          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                            {job.imagesAfter.map((src, i) => (
                              <Box
                                key={i}
                                component="img"
                                src={src}
                                alt={`หลังซ่อม ${i + 1}`}
                                sx={{
                                  width: 90,
                                  height: 90,
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '2px solid #86efac',
                                  cursor: 'pointer',
                                  transition: 'transform 0.15s',
                                  '&:hover': { transform: 'scale(1.05)' },
                                }}
                                onClick={() => setPreviewSrc(src)}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.secondary">ไม่มีรูปหลังซ่อม</Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right: Actions & Timeline */}
        <Grid item xs={12} md={4}>
          <Box className="card" sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
              การดำเนินการ
            </Typography>

            <Stack spacing={1.25}>
              {nextStatusMap[job.status] && (
                <Button
                  fullWidth
                  variant="contained"
                  disabled={updating}
                  onClick={handleActionButton}
                  className="btn-field-touch"
                  sx={{
                    backgroundColor: '#1b3752',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#112234' },
                  }}
                >
                  {updating ? 'กำลังอัปเดต...' : nextStatusButtonLabel[job.status]}
                </Button>
              )}

              {job.status === 'assigned' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => setRejectOpen(true)}
                  sx={{ fontWeight: 600 }}
                >
                  ปฏิเสธงานซ่อม
                </Button>
              )}

              {job.status === 'completed' && (
                <Typography variant="body2" color="#15803d" fontWeight={600} sx={{ textAlign: 'center', py: 1 }}>
                  งานนี้ดำเนินการเสร็จสมบูรณ์แล้ว
                </Typography>
              )}

              {job.status === 'rejected' && (
                <Typography variant="body2" color="#b91c1c" fontWeight={600} sx={{ textAlign: 'center', py: 1 }}>
                  งานนี้ถูกปฏิเสธแล้ว — รอมอบหมายใหม่
                </Typography>
              )}
            </Stack>
          </Box>

          <Box className="card" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
              ลำดับขั้นตอน
            </Typography>
            <RepairTimeline status={job.status} />
          </Box>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════
          Modal: ยืนยันจบงาน (บันทึกผลการซ่อม)
      ═══════════════════════════════════════════ */}
      <Dialog
        open={completeOpen}
        onClose={() => !updating && setCompleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1b3752', pb: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleRoundedIcon sx={{ color: '#16a34a' }} />
            <span>บันทึกผลการซ่อม</span>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.82rem' }}>
            กรุณากรอกรายละเอียดและแนบรูปภาพหลังซ่อมก่อนยืนยันจบงาน
          </Alert>

          {/* รายละเอียดการซ่อม */}
          <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 0.75 }}>
            รายละเอียดการซ่อม <span style={{ color: '#b91c1c' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            size="small"
            placeholder="เช่น เปลี่ยนสายไฟหลักใหม่ ระยะทาง 20 เมตร, ซ่อมหัวก๊อกและเปลี่ยนซีลยางใหม่, ตรวจสอบระบบไฟและเปลี่ยนฟิวส์แล้ว..."
            value={repairDetail}
            onChange={(e) => setRepairDetail(e.target.value)}
            sx={{ mb: 2.5 }}
            inputProps={{ id: 'repair-detail-input' }}
          />

          <Divider sx={{ mb: 2 }} />

          {/* อัปโหลดรูปหลังซ่อม */}
          <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 0.5 }}>
            รูปภาพหลังซ่อม <span style={{ color: '#b91c1c' }}>*</span>{' '}
            <Typography component="span" variant="caption" color="text.secondary">
              ({afterImages.length}/5 รูป — อย่างน้อย 1 รูป)
            </Typography>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
            ถ่ายภาพผลงานเพื่อเปรียบเทียบกับรูปก่อนซ่อมและเป็นหลักฐานยืนยัน
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {afterImages.map((img, i) => (
              <Box key={i} sx={{ position: 'relative', width: 80, height: 80 }}>
                <Box
                  component="img"
                  src={img.preview}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '2px solid #86efac',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => setAfterImages(afterImages.filter((_, idx) => idx !== i))}
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    backgroundColor: '#b91c1c',
                    color: '#ffffff',
                    p: 0.25,
                    '&:hover': { backgroundColor: '#7f1d1d' },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}

            {afterImages.length < 5 && (
              <Button
                component="label"
                variant="outlined"
                id="upload-after-image-btn"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '8px',
                  border: '2px dashed #94a3b8',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.25,
                  color: '#475569',
                  minWidth: 'unset',
                  '&:hover': { backgroundColor: '#f8fafc', borderColor: '#1b3752' },
                }}
              >
                <PhotoCameraRoundedIcon sx={{ fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  + เพิ่มรูป
                </Typography>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                />
              </Button>
            )}
          </Stack>

          {/* คำเตือนถ้ายังไม่ครบ */}
          {(!repairDetail.trim() || afterImages.length === 0) && (
            <Alert severity="warning" sx={{ mt: 2, fontSize: '0.8rem' }}>
              {!repairDetail.trim() && afterImages.length === 0
                ? 'กรุณากรอกรายละเอียดการซ่อมและแนบรูปภาพหลังซ่อมอย่างน้อย 1 รูป'
                : !repairDetail.trim()
                ? 'กรุณากรอกรายละเอียดการซ่อม'
                : 'กรุณาแนบรูปภาพหลังซ่อมอย่างน้อย 1 รูป'}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => { setCompleteOpen(false); setRepairDetail(''); setAfterImages([]) }}
            disabled={updating}
            sx={{ fontWeight: 600, color: '#475569' }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleCompleteJob}
            disabled={!canComplete || updating}
            startIcon={<CheckCircleRoundedIcon />}
            id="confirm-complete-btn"
            sx={{
              fontWeight: 700,
              backgroundColor: canComplete ? '#16a34a' : undefined,
              '&:hover': { backgroundColor: '#15803d' },
            }}
          >
            {updating ? 'กำลังบันทึก...' : 'ยืนยันจบงาน'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════
          Modal: ปฏิเสธงาน
      ═══════════════════════════════════════════ */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '8px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#b91c1c' }}>
          ระบุเหตุผลการปฏิเสธงาน
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            กรุณาระบุเหตุผลที่ไม่สามารถเข้าปฏิบัติงานได้ หัวหน้าช่างจะได้รับแจ้งและสั่งจ่ายงานให้ช่างคนใหม่
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            size="small"
            label="เหตุผลที่ไม่สามารถรับงานได้ *"
            placeholder="เช่น ติดงานซ่อมฉุกเฉินจุดอื่น, ไม่มีอะไหล่เฉพาะทาง, นอกเขตพื้นที่..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectOpen(false)}>ยกเลิก</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={rejecting || !rejectReason.trim()}
            sx={{ fontWeight: 600 }}
          >
            {rejecting ? 'กำลังส่งข้อมูล...' : 'ยืนยันปฏิเสธงาน'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════
          Preview รูปภาพขนาดเต็ม
      ═══════════════════════════════════════════ */}
      <Dialog
        open={!!previewSrc}
        onClose={() => setPreviewSrc(null)}
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none' } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setPreviewSrc(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              zIndex: 1,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.85)' },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          {previewSrc && (
            <Box
              component="img"
              src={previewSrc}
              alt="ขยายรูป"
              sx={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  )
}
