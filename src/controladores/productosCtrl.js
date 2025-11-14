import { conmysql } from "../db.js";
import cloudinary from '../config/cloudinary.js';

export const getProductos = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM productos');
    res.json({ cant: result.length, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getProductosxId = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [req.params.id]);
    if (result.length <= 0) return res.json({ cant: 0, message: "Producto no encontrado" });
    res.json({ cant: result.length, data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const postProductos = async (req, res) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
    let prod_imagen = null;

    if (req.files && req.files.prod_imagen) {
      const imagen = req.files.prod_imagen;
      const result = await cloudinary.uploader.upload(imagen.tempFilePath, { folder: "productos" });
      prod_imagen = result.secure_url;
    }

    const [result] = await conmysql.query(
      'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
    );

    res.json({ message: 'Producto registrado correctamente', prod_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const putProductosxId = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

    const [existing] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id=?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

    let prod_imagen = existing[0].prod_imagen;

    if (req.files && req.files.prod_imagen) {
      const imagen = req.files.prod_imagen;
      const result = await cloudinary.uploader.upload(imagen.tempFilePath, { folder: "productos" });
      prod_imagen = result.secure_url;

      // Opcional: si guardas public_id, podrías eliminar la anterior imagen
      // await cloudinary.uploader.destroy(public_id_anterior);
    }

    const [result] = await conmysql.query(
      `UPDATE productos 
       SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? 
       WHERE prod_id=?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    );

    const [fila] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
    res.json(fila[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id=?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

    // Si guardas public_id de Cloudinary, puedes eliminar la imagen:
    // await cloudinary.uploader.destroy(public_id);

    const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id=?', [id]);

    if (result.affectedRows <= 0) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
