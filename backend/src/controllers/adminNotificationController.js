import { query } from '../config/db.js'
import { pushMessage, buildNotificationFlexMessage } from '../utils/lineNotify.js'

// Helper for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @desc    Broadcast a notification to users via LINE
 * @route   POST /api/admin/notifications
 * @access  Private (Operator only)
 */
export async function broadcastNotification(req, res) {
  const { targetType, targetUserId, message, imageUrl } = req.body
  const senderAdminId = req.user.id // from auth middleware

  if (!message && !imageUrl) {
    return res.status(400).json({ message: 'กรุณาระบุข้อความหรือรูปภาพที่ต้องการแจ้งเตือน' })
  }

  try {
    let targets = [] // Array of { id, role, lineId }

    if (targetType === 'individual') {
      if (!targetUserId) {
        return res.status(400).json({ message: 'กรุณาระบุผู้ใช้งานที่ต้องการแจ้งเตือน' })
      }
      const { targetRole } = req.body
      if (!targetRole) {
         return res.status(400).json({ message: 'กรุณาระบุบทบาท (Role) ของผู้รับ' })
      }

      let lineIdRes
      if (targetRole === 'citizen') {
        lineIdRes = await query('SELECT line_id FROM tb_user WHERE user_id = $1', [targetUserId])
      } else if (targetRole === 'technician') {
        lineIdRes = await query('SELECT line_id FROM tb_technician WHERE technician_id = $1', [targetUserId])
      } else if (targetRole === 'operator') {
        lineIdRes = await query('SELECT line_id FROM tb_operator WHERE operator_id = $1', [targetUserId])
      }

      if (lineIdRes && lineIdRes.rows.length > 0) {
        targets.push({
          id: targetUserId,
          role: targetRole,
          lineId: lineIdRes.rows[0].line_id
        })
      }
    } else if (targetType === 'all_users') {
      const users = await query("SELECT user_id AS id, 'citizen' AS role, line_id FROM tb_user WHERE line_id IS NOT NULL")
      targets = users.rows.map(r => ({ id: r.id, role: r.role, lineId: r.line_id }))
    } else if (targetType === 'all_technicians') {
      const techs = await query("SELECT technician_id AS id, 'technician' AS role, line_id FROM tb_technician WHERE status = 'active' AND line_id IS NOT NULL")
      targets = techs.rows.map(r => ({ id: r.id, role: r.role, lineId: r.line_id }))
    } else {
      return res.status(400).json({ message: 'ประเภทกลุ่มเป้าหมายไม่ถูกต้อง' })
    }

    if (targets.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้ที่มี LINE ID ในกลุ่มเป้าหมายที่เลือก' })
    }

    // Build the messages array
    const lineOaBasicId = process.env.LINE_OA_BASIC_ID || ''
    const messagesToSend = []
    
    if (message) {
      messagesToSend.push(buildNotificationFlexMessage(message, lineOaBasicId))
    }
    
    if (imageUrl) {
      const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`
      let fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
      // เพิ่ม ngrok-skip-browser-warning เพื่อให้ LINE ดึงรูปผ่าน ngrok ได้
      if (fullImageUrl.includes('ngrok')) {
        fullImageUrl = `${fullImageUrl}?ngrok-skip-browser-warning=true`
      }
      messagesToSend.push({
        type: 'image',
        originalContentUrl: fullImageUrl,
        previewImageUrl: fullImageUrl
      })
    }

    let successCount = 0
    let failCount = 0

    // To respect LINE API rate limits, process in small batches or with delays
    // For simplicity, we loop sequentially with a small delay
    for (const target of targets) {
      if (!target.lineId) {
         failCount++
         continue
      }

      const result = await pushMessage(target.lineId, messagesToSend)
      
      let status = 'success'
      let errorDetail = null
      
      if (result.success) {
        successCount++
      } else {
        failCount++
        status = 'failed'
        errorDetail = result.error
      }

      // Log to tb_notification_log
      await query(
        `INSERT INTO tb_notification_log (sender_admin_id, target_type, target_user_id, target_role, message, status, error_detail)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [senderAdminId, targetType, target.id, target.role, message, status, errorDetail]
      )

      await delay(50) // 50ms delay between pushes
    }

    res.json({
      message: 'ส่งแจ้งเตือนเรียบร้อยแล้ว',
      summary: {
        total: targets.length,
        success: successCount,
        failed: failCount
      }
    })

  } catch (error) {
    console.error('Error broadcasting notification:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งแจ้งเตือน', error: error.message })
  }
}

/**
 * @desc    Get notification broadcast history
 * @route   GET /api/admin/notifications
 * @access  Private (Operator only)
 */
export async function getNotificationHistory(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit

    const history = await query(
      `SELECT log.id, log.target_type, log.target_user_id, log.target_role, log.message, log.status, log.error_detail, log.sent_at,
              op.name as sender_name
       FROM tb_notification_log log
       LEFT JOIN tb_operator op ON log.sender_admin_id = op.operator_id
       ORDER BY log.sent_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    const countRes = await query('SELECT COUNT(*) FROM tb_notification_log')
    const total = parseInt(countRes.rows[0].count)

    res.json({
      data: history.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching notification history:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติการแจ้งเตือน' })
  }
}
