import { query } from '../config/db.js'

/**
 * @desc    Get in-app notifications for the logged-in user
 * @route   GET /api/notifications
 * @access  Private
 */
export async function getNotifications(req, res) {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    const notifications = await query(
      `SELECT * FROM tb_notification 
       WHERE recipient_id = $1 AND recipient_role = $2
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId, userRole]
    )

    const unreadCountRes = await query(
      `SELECT COUNT(*) FROM tb_notification 
       WHERE recipient_id = $1 AND recipient_role = $2 AND is_read = false`,
      [userId, userRole]
    )

    res.json({
      notifications: notifications.rows,
      unreadCount: parseInt(unreadCountRes.rows[0].count)
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงการแจ้งเตือน' })
  }
}

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export async function markAsRead(req, res) {
  try {
    const { id } = req.params
    const userId = req.user.id
    const userRole = req.user.role

    const result = await query(
      `UPDATE tb_notification 
       SET is_read = true 
       WHERE id = $1 AND recipient_id = $2 AND recipient_role = $3
       RETURNING *`,
      [id, userId, userRole]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'ไม่พบการแจ้งเตือนหรือไม่มีสิทธิ์เข้าถึง' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน' })
  }
}

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    await query(
      `UPDATE tb_notification 
       SET is_read = true 
       WHERE recipient_id = $1 AND recipient_role = $2 AND is_read = false`,
      [userId, userRole]
    )

    res.json({ message: 'อ่านทั้งหมดแล้ว' })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน' })
  }
}
