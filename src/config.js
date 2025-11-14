import { config } from 'dotenv';
config();

// Configuración de base de datos
export const BD_HOST = process.env.BD_HOST;
export const BD_DATABASE = process.env.BD_DATABASE;
export const BD_USER = process.env.BD_USER;
export const BD_PASSWORD = process.env.BD_PASSWORD || ''; // si está vacío, usar ''
export const BD_PORT = Number(process.env.BD_PORT) || 3306;
export const PORT = Number(process.env.PORT) || 3000;

// Validar que las variables de entorno críticas estén definidas
if (!BD_HOST || !BD_DATABASE || !BD_USER) {
  console.error('❌ Faltan variables de entorno de la base de datos');
  process.exit(1);
}

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || '123';

// Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Opcional: imprimir configuración (sin mostrar contraseña) para debug
console.log('🔹 Configuración de base de datos:', {
  host: BD_HOST,
  database: BD_DATABASE,
  user: BD_USER,
  port: BD_PORT,
});
