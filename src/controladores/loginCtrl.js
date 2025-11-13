import jwt from 'jsonwebtoken';
import { conmysql } from '../db.js';
import { JWT_SECRET } from '../config.js';

export const login = async (req, res) => {
  console.log('🔹 Cuerpo recibido:', req.body);

  const { usr_usuario, usr_clave } = req.body;

  if (!usr_usuario || !usr_clave) {
    return res.status(400).json({ message: 'Debe ingresar usuario y clave' });
  }

  try {
    // Buscar usuario activo
    const [rows] = await conmysql.query(
      'SELECT * FROM usuarios WHERE usr_usuario = ? AND usr_activo = 1',
      [usr_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // 🔥 SIN MD5 → comparar tal cual viene
    if (user.usr_clave !== usr_clave) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.usr_id, usuario: user.usr_usuario, correo: user.usr_correo },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.usr_id,
        nombre: user.usr_nombre,
        correo: user.usr_correo,
        usuario: user.usr_usuario
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
