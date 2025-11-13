import { config } from 'dotenv';
config();

export const BD_HOST = process.env.BD_HOST;
export const BD_DATABASE = process.env.BD_DATABASE;
export const BD_USER = process.env.BD_USER;
export const BD_PASSWORD = process.env.BD_PASSWORD;
export const BD_PORT = Number(process.env.BD_PORT) || 3306;
export const PORT = Number(process.env.PORT) || 3000;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || '123';

// Validar que las variables de entorno estén definidas
if (!BD_HOST || !BD_DATABASE || !BD_USER) {
  console.error('❌ Error: faltan variables de entorno de base de datos.');
  process.exit(1);
}

console.log('🔹 Configuración cargada:', {
  host: BD_HOST,
  database: BD_DATABASE,
  user: BD_USER,
  port: BD_PORT,
});
