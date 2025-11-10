import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const conmysql = await mysql2.createPool({
  host: process.env.BD_HOST,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_DATABASE,
  port: process.env.BD_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  const [rows] = await conmysql.query('SELECT 1');
  console.log('✅ Conectado correctamente a la base de datos en Clever Cloud');
} catch (error) {
  console.error('❌ Error al conectar a la base de datos:', error);
}
