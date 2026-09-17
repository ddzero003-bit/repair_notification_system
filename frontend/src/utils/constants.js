// Central constants for Song Pluey Utility Repair System

export const ROLES = {
  CITIZEN: 'citizen',
  OPERATOR: 'operator',
  TECHNICIAN: 'technician',
}

export const REPAIR_CATEGORIES = [
  { value: 'electricity', label: 'ไฟฟ้า', code: 'ELEC', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { value: 'water', label: 'ประปา', code: 'WATER', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
]

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'ปกติ', color: 'default', badgeBg: '#f1f5f9', badgeText: '#475569', border: '#e2e8f0' },
  { value: 'normal', label: 'ปานกลาง', color: 'info', badgeBg: '#eff6ff', badgeText: '#2563eb', border: '#bfdbfe' },
  { value: 'high', label: 'เร่งด่วน', color: 'warning', badgeBg: '#fffbeb', badgeText: '#d97706', border: '#fde68a' },
  { value: 'urgent', label: 'ฉุกเฉิน', color: 'error', badgeBg: '#fef2f2', badgeText: '#dc2626', border: '#fecaca' },
]

export const REPAIR_STATUSES = [
  { value: 'reported', label: 'แจ้งแล้ว' },
  { value: 'accepted', label: 'รับเรื่องแล้ว' },
  { value: 'assigned', label: 'มอบหมายงานแล้ว' },
  { value: 'rejected', label: 'ปฏิเสธ' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancelled', label: 'ยกเลิก' },
]

export const STATUS_COLOR = {
  reported: { label: 'แจ้งแล้ว', color: '#2563eb', bg: '#eff6ff', border: '#dbeafe', dot: '#2563eb' },
  accepted: { label: 'รับเรื่องแล้ว', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', dot: '#0284c7' },
  assigned: { label: 'มอบหมายงานแล้ว', color: '#2563eb', bg: '#eff6ff', border: '#dbeafe', dot: '#2563eb' },
  in_progress: { label: 'กำลังดำเนินการ', color: '#d97706', bg: '#fffbeb', border: '#fef3c7', dot: '#d97706' },
  completed: { label: 'เสร็จสิ้น', color: '#16a34a', bg: '#f0fdf4', border: '#dcfce7', dot: '#16a34a' },
  cancelled: { label: 'ยกเลิก', color: '#dc2626', bg: '#fef2f2', border: '#fee2e2', dot: '#dc2626' },
  rejected: { label: 'ปฏิเสธ', color: '#dc2626', bg: '#fef2f2', border: '#fee2e2', dot: '#dc2626' },
  pending: { label: 'รอดำเนินการ', color: '#d97706', bg: '#fffbeb', border: '#fef3c7', dot: '#d97706' },
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