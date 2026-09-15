import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Box, Typography, Button, Grid, Stack, Divider } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'

export default function Home() {
  return (
    <Box sx={{ py: { xs: 4, md: 7 } }}>
      <Container maxWidth="md">
        {/* Main Official Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'block',
              mb: 0.5,
            }}
          >
            กองช่าง เทศบาลตำบลสงเปลือย
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.3,
              mb: 1.5,
            }}
          >
            ระบบรับแจ้งซ่อมไฟฟ้าสาธารณะและประปาหมู่บ้าน
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#475569',
              maxWidth: 640,
              lineHeight: 1.7,
            }}
          >
            ช่องทางบริการรับแจ้งเหตุขัดข้องของระบบสาธารณูปโภคในเขตพื้นที่เทศบาลตำบลสงเปลือย
            ประชาชนสามารถส่งเรื่อง แจ้งพิกัดสถานที่ และติดตามผลการซ่อมแซมได้โดยตรงผ่าน LINE Official Account
          </Typography>

          {/* Primary Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ mt: 3.5 }}
          >
            <Button
              component={Link}
              to="/line-oa"
              variant="contained"
              size="large"
              startIcon={<ChatBubbleOutlineRoundedIcon />}
              sx={{
                backgroundColor: '#1b3752',
                fontWeight: 600,
                fontSize: '0.95rem',
                py: 1.25,
                px: 3,
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#112234' },
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
                fontWeight: 600,
                fontSize: '0.95rem',
                py: 1.25,
                px: 3,
                borderRadius: '8px',
                borderColor: '#cbd5e1',
                color: '#1b3752',
              }}
            >
              ตรวจสอบสถานะคำขอ
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />

        {/* Scope & Responsibilities (Structured Text List, No Fluff Cards) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#0f172a', mb: 2 }}>
            ขอบเขตงานที่รับแจ้ง
          </Typography>

          <Grid container spacing={3}>
            {/* Electricity Scope */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <Typography variant="subtitle2" fontWeight={700} color="#b45309" sx={{ mb: 1 }}>
                  งานไฟฟ้าสาธารณะ
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  • โคมไฟถนนและไฟส่องสว่างสาธารณะดับหรือไม่ติด<br />
                  • สายไฟตกหย่อน กิ่งไม้พาดสาย หรือเสาไฟชำรุด<br />
                  • หม้อแปลงและตู้ควบคุมไฟฟ้าสาธารณะขัดข้อง
                </Typography>
              </Box>
            </Grid>

            {/* Water Scope */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <Typography variant="subtitle2" fontWeight={700} color="#0369a1" sx={{ mb: 1 }}>
                  งานประปาหมู่บ้าน
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  • ท่อเมนประปาแตก รั่วซึมบนพื้นถนนหรือทางเท้า<br />
                  • น้ำประปาไม่ไหล แรงดันน้ำอ่อน หรือน้ำมีสีขุ่น<br />
                  • ประตูน้ำและมาตรวัดน้ำส่วนกลางชำรุด
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />

        {/* Community Coverage Notice */}
        <Box sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <Typography variant="body2" color="#334155">
            <b>พื้นที่ให้บริการ:</b> ครอบคลุม 10 หมู่บ้านในเขตเทศบาลตำบลสงเปลือย ได้แก่ หมู่ 1 บ้านสงเปลือย, หมู่ 2 บ้านโนนสวรรค์, หมู่ 3 บ้านหนองบัว, หมู่ 4 บ้านดอนม่วง, หมู่ 5 บ้านโนนงาม, หมู่ 6 บ้านโคกกลาง, หมู่ 7 บ้านเหล่าหมากแงว, หมู่ 8 บ้านหนองขาม, หมู่ 9 บ้านหนองแสง และหมู่ 10 บ้านโนนสมบูรณ์
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
