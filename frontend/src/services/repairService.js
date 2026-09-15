import apiClient from './apiClient.js'

/**
 * Service Layer สำหรับจัดการรายการคำขอแจ้งซ่อม สถิติ และการมอบหมายงาน
 */
export const repairService = {
  /**
   * ดึงรายการคำขอแจ้งซ่อมทั้งหมด (GET /api/repairs)
   * @param {Object} filters - ตัวกรอง เช่น { status, category, reporterId, technicianId, search }
   */
  async list(filters = {}) {
    const { data } = await apiClient.get('/repairs', { params: filters })
    return data
  },

  /**
   * ดึงรายละเอียดคำขอแจ้งซ่อมตาม ID (GET /api/repairs/:id)
   */
  async getById(id) {
    const { data } = await apiClient.get(`/repairs/${id}`)
    return data
  },

  /**
   * สร้างรายการคำขอแจ้งซ่อมใหม่ (POST /api/repairs)
   */
  async create(payload) {
    const { data } = await apiClient.post('/repairs', payload)
    return data
  },

  /**
   * มอบหมายงานให้ช่างซ่อม (POST /api/repairs/:id/assign)
   * @param {string} id - รหัสแจ้งซ่อม เช่น SR2569-001
   * @param {number} technicianId - รหัสช่างซ่อม
   * @param {string} priority - ระดับความเร่งด่วน (low, normal, high, urgent)
   */
  async assignTechnician(id, technicianId, priority) {
    const { data } = await apiClient.post(`/repairs/${id}/assign`, { technicianId, priority })
    return data
  },

  /**
   * อัปเดตสถานะงานซ่อม (PATCH /api/repairs/:id/status)
   * @param {string} id - รหัสแจ้งซ่อม
   * @param {string} status - สถานะใหม่ (เช่น in_progress, completed)
   * @param {Object} extra - ข้อมูลเพิ่มเติม เช่น { repairResult, imagesAfter }
   */
  async updateStatus(id, status, extra = {}) {
    const { data } = await apiClient.patch(`/repairs/${id}/status`, { status, ...extra })
    return data
  },

  /**
   * ดึงรายชื่อช่างซ่อมทั้งหมดในระบบ (GET /api/users/technicians)
   */
  async listTechnicians() {
    const { data } = await apiClient.get('/users/technicians')
    return data
  },

  /**
   * ดึงข้อมูลสถิติภาพรวมสำหรับ Dashboard (GET /api/repairs/stats)
   */
  async getStats() {
    const { data } = await apiClient.get('/repairs/stats')
    return data
  },

  /**
   * ช่างปฏิเสธงานที่ได้รับมอบหมาย (POST /api/repairs/:id/reject)
   * @param {string} id - รหัสแจ้งซ่อม
   * @param {string} reason - เหตุผลที่ปฏิเสธ
   */
  async rejectAssignment(id, reason) {
    const { data } = await apiClient.post(`/repairs/${id}/reject`, { reason })
    return data
  },
}
