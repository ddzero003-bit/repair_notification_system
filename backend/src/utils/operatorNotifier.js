import { query } from '../config/db.js'

/**
 * สร้างการแจ้งเตือนในระบบ (In-app Notification) สำหรับ Operator ทุกคนที่สถานะ active
 * @param {Object} param
 * @param {string} param.requestId - รหัสคำขอ เช่น SR2569-019
 * @param {string} param.type - 'new_request' | 'rejected' | 'completed' | 'info'
 * @param {string} param.title - หัวข้อแจ้งเตือน
 * @param {string} param.message - รายละเอียดข้อความ
 */
export async function notifyOperatorsInApp({ requestId, type = 'new_request', title, message }) {
  try {
    const ops = await query(`SELECT operator_id FROM tb_operator WHERE status = 'active'`)
    for (const op of ops.rows) {
      await query(
        `INSERT INTO tb_notification (recipient_id, recipient_role, request_id, type, title, message, is_read, created_at)
         VALUES ($1, 'operator', $2, $3, $4, $5, false, NOW())`,
        [op.operator_id, requestId || null, type, title, message]
      )
    }
  } catch (err) {
    console.error('[Notification] Failed to notify operators in-app:', err)
  }
}
