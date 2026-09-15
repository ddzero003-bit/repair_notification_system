/**
 * AddLineOA — หน้าเพิ่มเพื่อน LINE OA พร้อม QR Code
 * Route: /line-oa
 */
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Container, Typography, Button, Stack, Divider, Paper,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'

const LINE_OA_URL = import.meta.env.VITE_LINE_OA_URL || 'https://line.me/R/ti/p/@yourlineoa'

// ขั้นตอนการใช้งาน 3 ขั้น
const STEPS = [
  {
    icon: <QrCode2RoundedIcon sx={{ fontSize: 36 }} />,
    step: '1',
    title: 'สแกน QR Code',
    desc: 'เปิดกล้องหรือแอป LINE แล้วสแกน QR Code เพื่อเพิ่มเพื่อน LINE OA',
    color: '#1b3752',
    bg: '#f0f5fa',
  },
  {
    icon: <ChatRoundedIcon sx={{ fontSize: 36 }} />,
    step: '2',
    title: 'เลือกเมนู "แจ้งซ่อม"',
    desc: 'กดเมนูแจ้งซ่อมใน Rich Menu หรือพิมพ์ "แจ้งซ่อม" เพื่อรับลิงก์ฟอร์ม',
    color: '#0369a1',
    bg: '#f0f8ff',
  },
  {
    icon: <AssignmentTurnedInRoundedIcon sx={{ fontSize: 36 }} />,
    step: '3',
    title: 'กรอกข้อมูลและส่ง',
    desc: 'กรอกรายละเอียดปัญหา แนบรูปภาพ และรอเจ้าหน้าที่ดำเนินการ',
    color: '#15803d',
    bg: '#f0fdf4',
  },
]

export default function AddLineOA() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="sm">

        {/* ── Header ── */}
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.875rem',
              mb: 2,
              px: 0,
              '&:hover': { backgroundColor: 'transparent', color: 'text.primary' },
            }}
          >
            กลับหน้าหลัก
          </Button>

          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', display: 'block', mb: 0.5 }}
          >
            ระบบแจ้งซ่อมสาธารณูปโภค · เทศบาลตำบลสงเปลือย
          </Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.3 }}>
            เพิ่มเพื่อน LINE OA เพื่อแจ้งซ่อม
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
            สแกน QR Code ด้านล่างเพื่อเพิ่มเพื่อน LINE Official Account
            จากนั้นสามารถแจ้งปัญหาไฟฟ้า ประปา และติดตามสถานะการซ่อมได้ทันที
          </Typography>
        </Box>

        {/* ── QR Code Card ── */}
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            p: { xs: 3, md: 4 },
            textAlign: 'center',
            mb: 3,
          }}
        >
          {/* QR Code Image */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              mb: 2,
            }}
          >
            <Box
              component="img"
              src="/line-qr.png"
              alt="QR Code เพิ่มเพื่อน LINE OA เทศบาลตำบลสงเปลือย"
              sx={{
                width: { xs: 200, sm: 240 },
                height: { xs: 200, sm: 240 },
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Box>

          <Typography variant="body1" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
            สแกนเพื่อเพิ่มเพื่อน
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            หากใช้โทรศัพท์มือถือ สามารถกดปุ่มด้านล่างเพื่อเปิด LINE ได้โดยตรง
          </Typography>

          {/* ปุ่มเปิด LINE OA */}
          <Button
            component="a"
            href={LINE_OA_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="large"
            fullWidth
            startIcon={
              <Box
                component="img"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI0IDRDMTIuOTU0IDQgNCA5LjgyNiA0IDE2Ljk3OWMwIDMuNjI1IDEuNzkyIDYuODg4IDQuNzIzIDkuMzQ3TDYgNDRsMTMuNDMyLTYuMTg0QzIwLjg3OCAzOC41NyAyMi40MTkgMzggMjQgMzhjMTEuMDQ2IDAgMjAtNS44NzMgMjAtMTMuMDIxUzM1LjA0NiA0IDI0IDR6Ii8+PC9zdmc+"
                sx={{ width: 20, height: 20 }}
                alt="LINE icon"
              />
            }
            sx={{
              backgroundColor: '#06c755',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              py: 1.5,
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#05a847' },
              boxShadow: 'none',
            }}
          >
            เปิด LINE OA
          </Button>
        </Paper>

        {/* ── แจ้งเตือน ── */}
        <Box
          sx={{
            p: 2,
            borderRadius: '10px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            mb: 4,
          }}
        >
          <Typography variant="body2" color="#166534" sx={{ lineHeight: 1.6, textAlign: 'center' }}>
            ✅ หลังจากเพิ่มเพื่อนแล้ว สามารถแจ้งปัญหาและติดตามสถานะการซ่อมผ่าน LINE OA ได้ทันที
          </Typography>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'divider' }} />

        {/* ── ขั้นตอนการใช้งาน ── */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 3, textAlign: 'center' }}>
            วิธีการแจ้งซ่อม
          </Typography>

          <Stack spacing={2}>
            {STEPS.map((s) => (
              <Box
                key={s.step}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: { xs: 2, md: 2.5 },
                  borderRadius: '12px',
                  backgroundColor: s.bg,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {/* Step Number + Icon */}
                <Box
                  sx={{
                    minWidth: 56,
                    height: 56,
                    borderRadius: '12px',
                    backgroundColor: s.color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {React.cloneElement(s.icon, { sx: { fontSize: 28, color: '#ffffff' } })}
                </Box>

                {/* Content */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: s.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography sx={{ color: '#ffffff', fontSize: '0.7rem', fontWeight: 700 }}>
                        {s.step}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                      {s.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    {s.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'divider' }} />

        {/* ── Footer Navigation ── */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
          <Button
            component={Link}
            to="/check-status"
            variant="outlined"
            startIcon={<SearchRoundedIcon />}
            sx={{
              fontWeight: 600,
              borderColor: 'divider',
              color: '#1b3752',
              borderRadius: '8px',
              py: 1.25,
              px: 3,
            }}
          >
            ตรวจสอบสถานะคำขอ
          </Button>
          <Button
            component={Link}
            to="/"
            variant="text"
            sx={{ fontWeight: 600, color: 'text.secondary', borderRadius: '8px' }}
          >
            กลับหน้าหลัก
          </Button>
        </Stack>

      </Container>
    </Box>
  )
}
