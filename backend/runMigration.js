import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  try {
    const migrationsDir = path.join(__dirname, 'sql/migrations');
    const files = fs.readdirSync(migrationsDir).sort();
    
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}...`);
        const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        await pool.query(migrationSql);
      }
    }
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

run();
