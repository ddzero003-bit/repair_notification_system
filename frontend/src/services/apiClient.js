import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants.js'

/**
 * Axios Instance กลางสำหรับส่ง HTTP Requests ทั้งหมดในระบบไปยัง Backend API
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 120000,
})

/**
 * Request Interceptor: แนบ JWT Bearer Token และ ngrok bypass header
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers['ngrok-skip-browser-warning'] = 'true'
  return config
})

/**
 * Response Interceptor: หากได้รับการตอบกลับเป็น 401 Unauthorized (โทเคนหมดอายุหรือการยืนยันตัวตนล้มเหลว)
 * ระบบจะลบ Token และข้อมูลผู้ใช้ออกจาก LocalStorage อัตโนมัติเพื่อล้างเซสชัน
 */
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
    return Promise.reject(error)
  }
)

export default apiClient
