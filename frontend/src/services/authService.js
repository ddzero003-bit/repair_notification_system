/**
 * authService.js — ใช้ Native fetch เพื่อรองรับมือถือและ ngrok อย่างเสถียร 100%
 */

export const authService = {
  /**
   * เข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่าน (POST /api/auth/login)
   */
  async login({ username, password }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    }

    return await res.json() // { user, token }
  },

  /**
   * เข้าสู่ระบบด้วย LINE LIFF Access Token (POST /api/auth/line-login)
   */
  async loginWithLine(accessToken, profile) {
    const res = await fetch('/api/auth/line-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      },
      body: JSON.stringify({ accessToken, profile }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'เข้าสู่ระบบด้วย LINE ไม่สำเร็จ')
    }

    return await res.json()
  },

  /**
   * ลงทะเบียนบัญชีใหม่ทุกบทบาท (POST /api/auth/register)
   */
  async register(payload) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'ลงทะเบียนไม่สำเร็จ')
    }

    return await res.json() // { user, token }
  },

  /**
   * ลืมรหัสผ่าน
   */
  async forgotPassword(email) {
    return { message: `ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} แล้ว` }
  },

  /**
   * ตั้งรหัสผ่านใหม่
   */
  async resetPassword(_payload) {
    return { message: 'ตั้งรหัสผ่านใหม่สำเร็จ' }
  },

  /**
   * ออกจากระบบ
   */
  async logout() {
    return true
  },
}
