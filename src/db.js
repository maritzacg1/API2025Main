import { createPool } from 'mysql2/promise';
import { BD_HOST, BD_DATABASE, BD_USER, BD_PASSWORD, BD_PORT } from './config.js';

export const conmysql = createPool({
  host: BD_HOST,
  user: BD_USER,
  password: BD_PASSWORD,
  database: BD_DATABASE,
  port: BD_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  const [rows] = await conmysql.query('SELECT 1');
  console.log('✅ Conectado correctamente a la base de datos');
} catch (error) {
  console.error('❌ Error al conectar a la base de datos:', error);
}
