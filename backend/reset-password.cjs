const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'repair_line_oa',
  user: 'postgres',
  password: '123456',
})

async function main() {
  const hash = await bcrypt.hash('123456', 10)
  console.log('New hash:', hash)

  await pool.query('UPDATE tb_operator SET password_hash = $1 WHERE username = $2', [hash, 'operator1'])
  console.log('operator1 password updated!')

  await pool.query('UPDATE tb_technician SET password_hash = $1 WHERE username = $2', [hash, 'tech1'])
  console.log('tech1 password updated!')

  await pool.end()
  console.log('Done!')
}

main().catch(console.error)
