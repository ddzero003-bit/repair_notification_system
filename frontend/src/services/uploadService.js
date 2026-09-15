/**
 * uploadService.js — ปรับปรุงให้รองรับ LINE In-App Browser และมือถือทุกรุ่น
 */

/**
 * บีบอัดรูปภาพด้วย HTML5 Canvas แบบรองรับ Mobile WebView 100%
 * ส่งคืนเป็น { blob, name } โดยไม่ใช้ new File() constructor (ซึ่งมัก error บน Android WebView)
 */
function compressImage(file, maxDimension = 1600, quality = 0.8) {
  return new Promise((resolve) => {
    // ถ้าไม่ใช่ไฟล์รูปภาพ หรือเป็น SVG/GIF
    if (!file.type || !file.type.startsWith('image/') || file.type === 'image/gif') {
      return resolve({ blob: file, name: file.name || 'image.jpg' })
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        try {
          let width = img.width
          let height = img.height

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            } else {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve({ blob: file, name: file.name || 'image.jpg' })
              }
              const safeName = (file.name || 'photo.jpg').replace(/\.[^/.]+$/, '') + '.jpg'
              resolve({ blob, name: safeName })
            },
            'image/jpeg',
            quality
          )
        } catch (err) {
          console.warn('Canvas resize error, fallback to original:', err)
          resolve({ blob: file, name: file.name || 'image.jpg' })
        }
      }
      img.onerror = () => resolve({ blob: file, name: file.name || 'image.jpg' })
      img.src = e.target.result
    }
    reader.onerror = () => resolve({ blob: file, name: file.name || 'image.jpg' })
    reader.readAsDataURL(file)
  })
}

/**
 * ฟังก์ชันสำหรับอัปโหลดไฟล์รูปภาพไปยัง Backend API (POST /api/upload)
 * ใช้ Native Fetch เพื่อความเข้ากันได้สูงสุดกับ LINE Webview และมือถือ
 * @param {File[]} files - รายชื่อไฟล์รูปภาพ
 * @returns {Promise<string[]>} - คืนค่าเป็น Array ของ URL รูปภาพ
 */
export async function uploadImages(files) {
  if (!files || files.length === 0) return []

  // 1. บีบอัดรูปภาพ
  const compressedItems = await Promise.all(files.map((file) => compressImage(file)))

  // 2. สร้าง FormData Object
  const formData = new FormData()
  compressedItems.forEach((item, index) => {
    const blob = item.blob || item
    const filename = item.name || `photo_${index + 1}.jpg`
    formData.append('images', blob, filename)
  })

  // 3. ส่ง Request ไปยัง /api/upload
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': '1',
    },
    body: formData,
  })

  if (!response.ok) {
    const errText = await response.text()
    let msg = 'อัปโหลดรูปภาพไม่สำเร็จ'
    try {
      const parsed = JSON.parse(errText)
      if (parsed.message) msg = parsed.message
    } catch {}
    throw new Error(msg)
  }

  const data = await response.json()
  return data.urls || []
}
