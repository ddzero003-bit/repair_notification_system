import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Container, Box, Typography, Button, Grid, Stack, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded'
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded'
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import SparklesIcon from '@mui/icons-material/AutoAwesomeRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { COMMUNITIES } from '../../utils/constants.js'

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* ============================================================
          1. HERO SECTION (Desktop 2 cols / Mobile 1 col)
      ============================================================ */}
      <Box
        sx={{
          pt: { xs: 4, md: 8 },
          pb: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
            {/* Left: Text & CTAs */}
            <Grid item xs={12} md={6.5}>
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.75,
                  py: 0.65,
                  borderRadius: '30px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1e40af',
                  mb: 3,
                }}
              >
                <SparklesIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  บริการประชาชนออนไลน์ · กองช่าง ทต.สงเปลือย
                </Typography>
              </Box>

              {/* H1 Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' },
                  color: '#0f172a',
                  lineHeight: { xs: 1.25, md: 1.2 },
                  letterSpacing: '-0.02em',
                  mb: 2.5,
                }}
              >
                ระบบแจ้งซ่อม
                <Box component="span" sx={{ color: '#2563eb', display: 'block', mt: 0.5 }}>
                  สาธารณูปโภค
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: '#475569',
                  lineHeight: 1.75,
                  maxWidth: 560,
                  mb: 4,
                }}
              >
                แจ้งปัญหาสาธารณูปโภคได้ง่าย รวดเร็ว ติดตามสถานะการซ่อมได้ทุกขั้นตอนผ่านระบบออนไลน์
                ส่งข้อมูลตรงถึงทีมช่างเทศบาลตำบลสงเปลือยตลอด 24 ชั่วโมง
              </Typography>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <Button
                  component={Link}
                  to="/line-oa"
                  variant="contained"
                  size="large"
                  startIcon={<ChatBubbleRoundedIcon />}
                  sx={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3.5,
                    borderRadius: '12px',
                    height: 52,
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                      boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.35)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  แจ้งซ่อมผ่าน LINE OA
                </Button>

                <Button
                  component={Link}
                  to="/check-status"
                  variant="outlined"
                  size="large"
                  startIcon={<SearchRoundedIcon />}
                  sx={{
                    borderColor: '#cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3,
                    borderRadius: '12px',
                    height: 52,
                    '&:hover': {
                      borderColor: '#93c5fd',
                      backgroundColor: '#eff6ff',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  ตรวจสอบสถานะคำขอ
                </Button>
              </Stack>

              {/* Trust Micro-Badges */}
              <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <VerifiedRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    บริการฟรี ไม่มีค่าใช้จ่าย
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <VerifiedRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    ครอบคลุม 10 หมู่บ้าน
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <VerifiedRoundedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    ติดตามผลได้ตลอดเวลา
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Right: Modern Hero Visual & Status Cards */}
            <Grid item xs={12} md={5.5}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, sm: 4 },
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                  border: '1px solid #dbeafe',
                  boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.08)',
                }}
              >
                {/* Central Utility Graphic Representation */}
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fde68a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d97706',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
                      }}
                    >
                      <ElectricBoltRoundedIcon sx={{ fontSize: 36 }} />
                    </Box>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        backgroundColor: '#e0f2fe',
                        border: '1px solid #bae6fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0284c7',
                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
                      }}
                    >
                      <WaterDropRoundedIcon sx={{ fontSize: 36 }} />
                    </Box>
                  </Stack>

                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ mb: 0.5 }}>
                    เทศบาลตำบลสงเปลือย
                  </Typography>
                  <Typography variant="caption" color="#64748b" sx={{ fontSize: '0.8rem' }}>
                    ศูนย์รับเรื่องและติดตามงานซ่อมสาธารณูปโภคแบบเรียลไทม์
                  </Typography>
                </Box>

                {/* 3 Floating Status Cards */}
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {/* Status 1: Completed */}
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircleRoundedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.3 }}>
                        ซ่อมเสร็จสิ้น — เปิดใช้งานได้ตามปกติ
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                        โคมไฟถนนดับ · หมู่ 1 บ้านสงเปลือย (ปิดงานแล้ว)
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label="เสร็จสิ้น"
                      sx={{ backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Box>

                  {/* Status 2: In Progress */}
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: '#fffbeb',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <TimelineRoundedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.3 }}>
                        กำลังดำเนินการ — ช่างลงพื้นที่ตรวจสอบ
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                        ท่อเมนประปารั่วซึม · หมู่ 3 บ้านหนองบัว
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label="กำลังซ่อม"
                      sx={{ backgroundColor: '#fffbeb', color: '#d97706', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Box>

                  {/* Status 3: Reported / Success */}
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <LocationOnRoundedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.3 }}>
                        แจ้งเรื่องสำเร็จ — ได้รับพิกัด GPS และรูปถ่าย
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                        สายไฟกิ่งไม้พาด · หมู่ 5 บ้านโนนงาม (รอช่างรับงาน)
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label="รับเรื่องแล้ว"
                      sx={{ backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================================================
          2. QUICK ACTIONS ("ต้องการความช่วยเหลือ?")
      ============================================================ */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.05em' }}>
              QUICK SERVICES
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
              ต้องการความช่วยเหลือ?
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1, maxWidth: 520, mx: 'auto' }}>
              เลือกบริการที่ต้องการเพื่อเริ่มต้นใช้งานระบบแจ้งซ่อมสาธารณูปโภคได้อย่างสะดวกรวดเร็ว
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Action 1: แจ้งปัญหา */}
            <Grid item xs={12} sm={4}>
              <Box
                component={Link}
                to="/line-oa"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: '#bfdbfe',
                    boxShadow: '0 12px 28px -8px rgba(37, 99, 235, 0.12)',
                    transform: 'translateY(-3px)',
                    '& .action-arrow': { transform: 'translateX(4px)', color: '#2563eb' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  <AssignmentOutlinedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 1 }}>
                  1. แจ้งปัญหา
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6, flex: 1, mb: 2 }}>
                  ส่งรายละเอียดปัญหาสาธารณูปโภค ถ่ายรูปจุดเกิดเหตุ และปักหมุดตำแหน่งได้ทันที
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2563eb', fontWeight: 700, fontSize: '0.875rem' }}>
                  แจ้งเรื่องผ่าน LINE OA
                  <ArrowForwardRoundedIcon className="action-arrow" sx={{ fontSize: 18, transition: 'transform 0.2s' }} />
                </Box>
              </Box>
            </Grid>

            {/* Action 2: ตรวจสอบสถานะ */}
            <Grid item xs={12} sm={4}>
              <Box
                component={Link}
                to="/check-status"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: '#bfdbfe',
                    boxShadow: '0 12px 28px -8px rgba(37, 99, 235, 0.12)',
                    transform: 'translateY(-3px)',
                    '& .action-arrow': { transform: 'translateX(4px)', color: '#2563eb' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  <SearchRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 1 }}>
                  2. ตรวจสอบสถานะ
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6, flex: 1, mb: 2 }}>
                  ติดตามความคืบหน้าการซ่อม ตรวจสอบว่าช่างได้รับงานหรือปิดงานเรียบร้อยแล้วหรือไม่
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2563eb', fontWeight: 700, fontSize: '0.875rem' }}>
                  ค้นหาคำขอซ่อม
                  <ArrowForwardRoundedIcon className="action-arrow" sx={{ fontSize: 18, transition: 'transform 0.2s' }} />
                </Box>
              </Box>
            </Grid>

            {/* Action 3: ติดต่อหน่วยงาน */}
            <Grid item xs={12} sm={4}>
              <Box
                onClick={() => setContactOpen(true)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: '#bfdbfe',
                    boxShadow: '0 12px 28px -8px rgba(37, 99, 235, 0.12)',
                    transform: 'translateY(-3px)',
                    '& .action-arrow': { transform: 'translateX(4px)', color: '#2563eb' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  <PhoneInTalkRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 1 }}>
                  3. ติดต่อหน่วยงาน
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6, flex: 1, mb: 2 }}>
                  สอบถามข้อมูลหรือขอความช่วยเหลือเร่งด่วนจากกองช่าง เทศบาลตำบลสงเปลือย
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#16a34a', fontWeight: 700, fontSize: '0.875rem' }}>
                  ดูข้อมูลติดต่อ
                  <ArrowForwardRoundedIcon className="action-arrow" sx={{ fontSize: 18, transition: 'transform 0.2s' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================================================
          3. HOW IT WORKS ("แจ้งซ่อมง่าย ๆ เพียง 3 ขั้นตอน")
      ============================================================ */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.05em' }}>
              HOW IT WORKS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
              แจ้งซ่อมง่าย ๆ เพียง 3 ขั้นตอน
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1, maxWidth: 520, mx: 'auto' }}>
              ขั้นตอนการใช้งานที่เข้าใจง่าย เหมาะกับประชาชนทุกเพศทุกวัยในชุมชน
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Step 1 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <QrCodeScannerRoundedIcon sx={{ fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#e2e8f0' }}>
                    01
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 1 }}>
                  เพิ่มเพื่อน LINE OA
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.7 }}>
                  เปิดกล้องโทรศัพท์หรือแอปพลิเคชัน LINE เพื่อสแกน QR Code หรือเพิ่มเพื่อนกับระบบแจ้งซ่อมเทศบาล
                </Typography>
              </Box>
            </Grid>

            {/* Step 2 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocationOnRoundedIcon sx={{ fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#e2e8f0' }}>
                    02
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 1 }}>
                  กรอกข้อมูลและส่งหลักฐาน
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.7 }}>
                  กดเมนูแจ้งซ่อม ระบุอาการปัญหา แนบภาพถ่ายจุดที่ชำรุด และปักหมุดพิกัดตำแหน่งได้อย่างง่ายดาย
                </Typography>
              </Box>
            </Grid>

            {/* Step 3 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: '#f0fdf4',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TimelineRoundedIcon sx={{ fontSize: 26 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#e2e8f0' }}>
                    03
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 1 }}>
                  ติดตามสถานะการซ่อม
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.7 }}>
                  รับการแจ้งเตือนอัตโนมัติเมื่อทีมช่างรับงาน ลงพื้นที่ซ่อมแซม และปิดงานพร้อมส่งรูปหลังซ่อมเสร็จ
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================================================
          4. SERVICE CATEGORY (Modern Service Cards 2 คอลัมน์)
      ============================================================ */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.05em' }}>
              SERVICE SCOPE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
              ขอบเขตงานที่รับแจ้ง
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1, maxWidth: 520, mx: 'auto' }}>
              เทศบาลตำบลสงเปลือยให้บริการรับแจ้งเหตุขัดข้องใน 2 สายงานหลัก
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {/* Card 1: งานไฟฟ้าสาธารณะ */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: { xs: 3.5, md: 4 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fef08a',
                  boxShadow: '0 4px 20px -4px rgba(245, 158, 11, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.25s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.14)',
                  },
                }}
              >
                {/* Accent Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ElectricBoltRoundedIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#0f172a">
                      งานไฟฟ้าสาธารณะ
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 600 }}>
                      กองช่าง ฝ่ายไฟฟ้าและแสงสว่าง
                    </Typography>
                  </Box>
                </Box>

                {/* Details List */}
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', mt: 0.9, flexShrink: 0 }} />
                    <Typography variant="body1" color="#334155" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                      <b>โคมไฟถนนและไฟส่องสว่างชำรุด:</b> ไฟทางดับ ไฟกระพริบ หรือหลอดไฟขาดตลอดเส้นทาง
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', mt: 0.9, flexShrink: 0 }} />
                    <Typography variant="body1" color="#334155" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                      <b>สายไฟภายนอกหรือเสาไฟฟ้าชำรุด:</b> สายไฟตกหย่อน กิ่งไม้พาดสาย เสาไฟเอียงหรือหัก
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', mt: 0.9, flexShrink: 0 }} />
                    <Typography variant="body1" color="#334155" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                      <b>ตู้ควบคุมไฟฟ้าสาธารณะขัดข้อง:</b> สวิตช์อัตโนมัติเสีย หม้อแปลงหรือเบรกเกอร์ทริป
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Card 2: งานประปาหมู่บ้าน */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: { xs: 3.5, md: 4 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #bae6fd',
                  boxShadow: '0 4px 20px -4px rgba(2, 132, 199, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.25s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px -4px rgba(2, 132, 199, 0.14)',
                  },
                }}
              >
                {/* Accent Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <WaterDropRoundedIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#0f172a">
                      งานประปาหมู่บ้าน
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600 }}>
                      กองช่าง ฝ่ายประปาและสุขาภิบาล
                    </Typography>
                  </Box>
                </Box>

                {/* Details List */}
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0284c7', mt: 0.9, flexShrink: 0 }} />
                    <Typography variant="body1" color="#334155" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                      <b>ท่อแตกหรือแตกรั่ว:</b> ท่อเมนประปาแตก น้ำรั่วซึมบนผิวถนน ทางเท้า หรือพื้นที่สาธารณะ
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0284c7', mt: 0.9, flexShrink: 0 }} />
                    <Typography variant="body1" color="#334155" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                      <b>น้ำประปาไม่ไหล / แรงดันน้ำอ่อน:</b> น้ำหยุดไหลทั้งซอย แรงดันน้ำไม่สม่ำเสมอ หรือน้ำมีสีขุ่น
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0284c7', mt: 0.9, flexShrink: 0 }} />
                    <Typography variant="body1" color="#334155" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                      <b>ประตูน้ำและมาตรวัดส่วนกลางชำรุด:</b> วาล์วควบคุมน้ำส่วนรวมรั่ว หรือชำรุดเสียหาย
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================================================
          5. SERVICE AREA ("พื้นที่ให้บริการ") - 10 หมู่บ้านในรูปแบบ Chips
      ============================================================ */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 3.5, md: 5 },
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3.5 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  mb: 1.5,
                }}
              >
                <LocationOnRoundedIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  COVERAGE AREA
                </Typography>
              </Box>

              <Typography variant="h5" fontWeight={800} color="#0f172a">
                พื้นที่ให้บริการ
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
                ครอบคลุม 10 หมู่บ้านในเขตเทศบาลตำบลสงเปลือย อำเภอนามน จังหวัดกาฬสินธุ์
              </Typography>
            </Box>

            {/* 10 Community Badges / Chips */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1.5,
                maxWidth: 960,
                mx: 'auto',
              }}
            >
              {COMMUNITIES.map((name, index) => (
                <Chip
                  key={name}
                  label={name}
                  sx={{
                    px: 1.5,
                    py: 2.25,
                    borderRadius: '12px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1e40af',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#dbeafe',
                      transform: 'translateY(-1px)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ============================================================
          6. TRUST / INFORMATION ("บริการเพื่อชุมชนของเรา")
      ============================================================ */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 3.5, md: 5 },
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
              border: '1px solid #dbeafe',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" fontWeight={800} color="#0f172a">
                บริการเพื่อชุมชนของเรา
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
                มาตรฐานการให้บริการดิจิทัล เพื่อความสะดวก โปร่งใส และรวดเร็วของประชาชนทุกคน
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 24, flexShrink: 0, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      แจ้งปัญหาได้ตลอดเวลา
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block', mt: 0.25 }}>
                      ระบบออนไลน์เปิดรับเรื่อง 24 ชั่วโมง ไม่ต้องรอเวลาทำการ
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 24, flexShrink: 0, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      ติดตามสถานะการซ่อมได้
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block', mt: 0.25 }}>
                      ตรวจสอบความคืบหน้าได้ทุกขั้นตอนตั้งแต่รับเรื่องจนซ่อมเสร็จ
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 24, flexShrink: 0, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      รองรับการแนบรูปภาพ
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block', mt: 0.25 }}>
                      ถ่ายรูปจุดที่ชำรุดส่งให้ช่างประเมินอุปกรณ์และอะไหล่ได้ล่วงหน้า
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 24, flexShrink: 0, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      รองรับตำแหน่ง GPS
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block', mt: 0.25 }}>
                      ปักหมุดพิกัดเสาไฟหรือจุดท่อแตก ช่างเดินทางไปถึงจุดได้แม่นยำ
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 24, flexShrink: 0, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      แจ้งผลการซ่อมผ่าน LINE
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block', mt: 0.25 }}>
                      รับข้อความแจ้งเตือนเมื่อซ่อมเสร็จสิ้นพร้อมภาพถ่ายผลงาน
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 24, flexShrink: 0, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      ไม่มีค่าใช้จ่ายในการบริการ
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.5, display: 'block', mt: 0.25 }}>
                      เป็นสวัสดิการการดูแลสาธารณูปโภคขั้นพื้นฐานเพื่อประชาชน
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ============================================================
          Dialog: ข้อมูลติดต่อหน่วยงาน (Modal)
      ============================================================ */}
      <Dialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
          ติดต่อหน่วยงาน
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                หน่วยงานรับผิดชอบ:
              </Typography>
              <Typography variant="body2" fontWeight={700} color="#0f172a" sx={{ mt: 0.25 }}>
                กองช่าง สำนักงานเทศบาลตำบลสงเปลือย
              </Typography>
              <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 0.5 }}>
                เลขที่ 304 หมู่ 5 ตำบลสงเปลือย อำเภอนามน จังหวัดกาฬสินธุ์ 46230
              </Typography>
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
              <Typography variant="caption" color="#1e40af" fontWeight={700}>
                เบอร์โทรศัพท์สำนักงาน:
              </Typography>
              <Typography
                component="a"
                href="tel:043019758"
                variant="body1"
                fontWeight={800}
                color="#2563eb"
                sx={{ display: 'block', mt: 0.25, textDecoration: 'none' }}
              >
                043-019758
              </Typography>
              <Typography variant="caption" color="#64748b">
                (ในวันและเวลาราชการ 08:30 - 16:30 น.)
              </Typography>
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                อีเมลสารบรรณอิเล็กทรอนิกส์:
              </Typography>
              <Typography
                component="a"
                href="mailto:saraban_05460202@dla.go.th"
                variant="body2"
                fontWeight={700}
                color="#2563eb"
                sx={{ display: 'block', mt: 0.25, textDecoration: 'none', wordBreak: 'break-all' }}
              >
                saraban_05460202@dla.go.th
              </Typography>
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <Typography variant="caption" color="#166534" fontWeight={700}>
                กรณีเหตุฉุกเฉิน 24 ชั่วโมง:
              </Typography>
              <Typography variant="body1" fontWeight={800} color="#16a34a" sx={{ mt: 0.25 }}>
                แจ้งผ่าน LINE Official Account
              </Typography>
              <Typography variant="caption" color="#64748b">
                ทีมงานพร้อมรับเรื่องและส่งต่อเจ้าหน้าที่เวรทันที
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setContactOpen(false)}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#2563eb',
              borderRadius: '10px',
              fontWeight: 700,
              py: 1,
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            ปิดหน้าต่าง
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
