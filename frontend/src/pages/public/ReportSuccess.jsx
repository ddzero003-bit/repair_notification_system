/**
 * ReportSuccess — หน้าสรุปผลการแจ้งซ่อมสำเร็จ (เทศบาลตำบลสงเปลือย)
 */
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Box, Typography, Paper, Button, Stack, Alert,
} from '@mui/material'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

export default function ReportSuccess() {
  const { id } = useParams()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(id || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
      <Box sx={{ maxWidth: 440, width: '100%' }}>
        <Paper className="card" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700} color="#15803d" sx={{ mb: 1 }}>
            ส่งข้อมูลแจ้งซ่อมเรียบร้อยแล้ว
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
            ระบบได้รับเรื่องของท่านแล้ว เจ้าหน้าที่กองช่างจะตรวจสอบและมอบหมายช่างเข้าดำเนินการ
          </Typography>

          {/* Repair ID Box */}
          <Box
            sx={{
              p: 2.5,
              mb: 3,
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
              หมายเลขคำขอแจ้งซ่อม (Repair ID)
            </Typography>
            <Typography variant="h4" fontWeight={700} color="#3b82f6" sx={{ my: 1 }}>
              {id}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopyRoundedIcon />}
              onClick={handleCopy}
              sx={{ mt: 1, fontSize: '0.8125rem' }}
            >
              {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกหมายเลขคำขอ'}
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3, textAlign: 'left', borderRadius: '6px', fontSize: '0.8125rem' }}>
            กรุณาจดจำหรือคัดลอกหมายเลขคำขอนี้ไว้สำหรับใช้ติดตามสถานะการซ่อมแซม
          </Alert>

          <Button
            component={Link}
            to={`/check-status?id=${id}`}
            variant="contained"
            fullWidth
            startIcon={<SearchRoundedIcon />}
            sx={{
              backgroundColor: '#3b82f6',
              fontWeight: 600,
              py: 1.25,
              '&:hover': { backgroundColor: '#2563eb' },
            }}
          >
            ไปที่หน้าตรวจสอบสถานะ
          </Button>
        </Paper>
      </Box>
    </Box>
  )
}
