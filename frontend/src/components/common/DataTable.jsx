import React, { useMemo, useState } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  TextField, InputAdornment, Box, TableSortLabel, Typography,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EmptyState from './EmptyState.jsx'

export default function DataTable({
  columns,
  rows,
  searchPlaceholder = 'ค้นหารายการ...',
  searchKeys = [],
  onRowClick,
  title,
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState(null)
  const [order, setOrder] = useState('asc')

  const filtered = useMemo(() => {
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))
    )
  }, [rows, search, searchKeys])

  const sorted = useMemo(() => {
    if (!orderBy) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[orderBy]
      const bv = b[orderBy]
      if (av < bv) return order === 'asc' ? -1 : 1
      if (av > bv) return order === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, orderBy, order])

  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleSort = (key) => {
    if (orderBy === key) setOrder(order === 'asc' ? 'desc' : 'asc')
    else {
      setOrderBy(key)
      setOrder('asc')
    }
  }

  return (
    <Box className="card">
      {/* Table Header / Filter Bar */}
      {(title || searchKeys.length > 0) && (
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1.5,
          }}
        >
          {title && (
            <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
              {title}
            </Typography>
          )}

          {searchKeys.length > 0 && (
            <Box sx={{ flex: 1, maxWidth: { sm: 320 } }}>
              <TextField
                size="small"
                fullWidth
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(0)
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Table Rows */}
      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: '#475569',
                    py: 1.25,
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={order}
                      onClick={() => handleSort(col.key)}
                      sx={{
                        '&.Mui-active': { color: '#0f172a', fontWeight: 700 },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((row, idx) => (
              <TableRow
                key={row.role ? `${row.role}-${row.id}` : (row.id || idx)}
                hover
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': { backgroundColor: '#f8fafc !important' },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      py: 1.5,
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {sorted.length === 0 ? (
        <EmptyState
          title="ไม่พบข้อมูล"
          description="ลองปรับคำค้นหาหรือตัวกรองเพื่อดูรายการใหม่อีกครั้ง"
        />
      ) : (
        <TablePagination
          component="div"
          count={sorted.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value)
            setPage(0)
          }}
          labelRowsPerPage="แถวต่อหน้า:"
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.8125rem',
              color: '#64748b',
            },
          }}
        />
      )}
    </Box>
  )
}
