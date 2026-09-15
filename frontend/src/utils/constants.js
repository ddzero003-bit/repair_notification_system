// Central constants for Song Pluey Utility Repair System

export const ROLES = {
  CITIZEN: 'citizen',
  OPERATOR: 'operator',
  TECHNICIAN: 'technician',
}

export const REPAIR_CATEGORIES = [
  { value: 'electricity', label: 'ไฟฟ้าสาธารณะ', code: 'ELEC', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { value: 'water', label: 'ประปาหมู่บ้าน', code: 'WATER', color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
]

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'ปกติ', color: 'default', badgeBg: '#f1f5f9', badgeText: '#475569', border: '#e2e8f0' },
  { value: 'normal', label: 'ปานกลาง', color: 'info', badgeBg: '#f0f9ff', badgeText: '#0369a1', border: '#bae6fd' },
  { value: 'high', label: 'เร่งด่วน', color: 'warning', badgeBg: '#fffbeb', badgeText: '#b45309', border: '#fde68a' },
  { value: 'urgent', label: 'ฉุกเฉิน', color: 'error', badgeBg: '#fef2f2', badgeText: '#b91c1c', border: '#fecaca' },
]

export const REPAIR_STATUSES = [
  { value: 'reported', label: 'แจ้งเรื่องแล้ว' },
  { value: 'accepted', label: 'รับเรื่องแล้ว' },
  { value: 'assigned', label: 'มอบหมายช่างแล้ว' },
  { value: 'rejected', label: 'ช่างปฏิเสธ' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancelled', label: 'ยกเลิก' },
]

export const STATUS_COLOR = {
  reported: { label: 'แจ้งแล้ว', color: '#334155', bg: '#f1f5f9', border: '#e2e8f0', dot: '#64748b' },
  accepted: { label: 'รับเรื่องแล้ว', color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd', dot: '#0284c7' },
  assigned: { label: 'มอบหมายแล้ว', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe', dot: '#2563eb' },
  in_progress: { label: 'กำลังดำเนินการ', color: '#b45309', bg: '#fffbeb', border: '#fde68a', dot: '#d97706' },
  completed: { label: 'เสร็จสิ้น', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a' },
  cancelled: { label: 'ยกเลิก', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca', dot: '#dc2626' },
  rejected: { label: 'ช่างปฏิเสธ', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca', dot: '#dc2626' },
  pending: { label: 'รอดำเนินการ', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0', dot: '#94a3b8' },
}

export const STORAGE_KEYS = {
  TOKEN: 'ru_token',
  USER: 'ru_user',
}

// หมู่บ้านในเขตเทศบาลตำบลสงเปลือย
export const COMMUNITIES = [
  'หมู่ 1 บ้านสงเปลือย',
  'หมู่ 2 บ้านโนนสวรรค์',
  'หมู่ 3 บ้านหนองบัว',
  'หมู่ 4 บ้านดอนม่วง',
  'หมู่ 5 บ้านโนนงาม',
  'หมู่ 6 บ้านโคกกลาง',
  'หมู่ 7 บ้านเหล่าหมากแงว',
  'หมู่ 8 บ้านหนองขาม',
  'หมู่ 9 บ้านหนองแสง',
  'หมู่ 10 บ้านโนนสมบูรณ์',
]