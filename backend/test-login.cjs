const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost', port: 5432,
  database: 'repair_line_oa', user: 'postgres', password: '123456',
})

async function main() {
  // ดึง hash ปัจจุบัน
  const op = await pool.query('SELECT username, password_hash FROM tb_operator WHERE username = $1', ['operator1'])
  console.log('operator1 hash:', op.rows[0]?.password_hash)

  // ทดสอบ compare
  const match = await bcrypt.compare('123456', op.rows[0]?.password_hash)
  console.log('Password match:', match)

  const tech = await pool.query('SELECT username, password_hash FROM tb_technician WHERE username = $1', ['tech1'])
  console.log('tech1 hash:', tech.rows[0]?.password_hash)
  const match2 = await bcrypt.compare('123456', tech.rows[0]?.password_hash)
  console.log('Password match:', match2)

  await pool.end()
}

main().catch(console.error)
