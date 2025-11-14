import { conmysql } from '../db.js'; // tu pool de MySQL
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const login = async (req, res) => {
  try {
    const { usr_usuario, usr_clave } = req.body;

    if (!usr_usuario || !usr_clave) {
      return res.status(400).json({ message: 'Usuario y clave son requeridos' });
    }

    // Buscar usuario en la base de datos
    const [rows] = await conmysql.query(
      'SELECT * FROM usuarios WHERE usr_usuario = ? AND usr_clave = ?',
      [usr_usuario, usr_clave]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o clave incorrectos' });
    }

    const user = rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { id: user.usr_id, usr_usuario: user.usr_usuario }, // <- renombrado
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Respuesta con propiedades que coinciden con la DB/frontend
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.usr_id,
        usr_usuario: user.usr_usuario, // <- renombrado
        rol: user.usr_rol || 'usuario'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
