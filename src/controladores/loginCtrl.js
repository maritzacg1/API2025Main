import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { conmysql } from '../db.js';
import { JWT_SECRET } from '../config.js';

// Función para convertir texto a MD5
const md5Hash = (texto) => createHash('md5').update(texto).digest('hex');

export const login = async (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ message: 'Debe ingresar usuario y clave' });
  }

  try {
    // Buscamos al usuario activo
    const [rows] = await conmysql.query(
      'SELECT * FROM usuarios WHERE usr_usuario = ? AND usr_activo = 1',
      [usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const claveMD5 = md5Hash(clave); // Convertimos la clave ingresada a MD5

    if (user.usr_clave !== claveMD5) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generamos token JWT
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
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};