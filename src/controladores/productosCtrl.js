import { conmysql } from "../db.js";

// 🔹 Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM productos");
    res.json(result);
  } catch (error) {
    console.error("Error al consultar productos:", error);
    return res.status(500).json({ message: "Error al consultar productos" });
  }
};

// 🔹 Obtener producto por ID
export const getproductosxid = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [req.params.id]);
    if (result.length <= 0)
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    res.json(result[0]);
  } catch (error) {
    console.error("Error al consultar producto por ID:", error);
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

// 🔹 Registrar nuevo producto (híbrido local/Cloudinary)
export const postProducto = async (req, res) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;

    // Si envían URL (Cloudinary), usarla; si envían archivo local, usar path
    let imagenFinal = null;
    if (prod_imagen && prod_imagen.startsWith('http')) {
      imagenFinal = prod_imagen;
    } else if (req.file) {
      imagenFinal = `/uploads/${req.file.filename}`;
    }

    // Verificar si ya existe el código
    const [existe] = await conmysql.query(
      "SELECT * FROM productos WHERE prod_codigo = ?",
      [prod_codigo]
    );
    if (existe.length > 0) {
      return res.status(409).json({
        id: 0,
        message: `⚠️ El producto con código ${prod_codigo} ya existe.`,
      });
    }

    const [row] = await conmysql.query(
      "INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)",
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, imagenFinal]
    );

    res.send({
      id: row.insertId,
      message: "✅ Producto registrado correctamente",
    });
  } catch (error) {
    console.error("Error en postProducto:", error);
    return res.status(500).json({ message: "❌ Error del lado del servidor" });
  }
};

// 🔹 Editar producto existente (híbrido local/Cloudinary)
export const putProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;

    let imagenFinal = null;
    if (prod_imagen && prod_imagen.startsWith('http')) {
      imagenFinal = prod_imagen;
    } else if (req.file) {
      imagenFinal = `/uploads/${req.file.filename}`;
    } else {
      // Mantener la imagen actual si no envían nada
      const [rows] = await conmysql.query("SELECT prod_imagen FROM productos WHERE prod_id = ?", [id]);
      if (rows && rows.length > 0) imagenFinal = rows[0].prod_imagen;
      else return res.status(404).json({ message: "Producto no encontrado" });
    }

    const [result] = await conmysql.query(
      `UPDATE productos 
       SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, 
           prod_precio = ?, prod_activo = ?, prod_imagen = ? 
       WHERE prod_id = ?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, imagenFinal, id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const [rows] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error en putProducto:", error);
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

// 🔹 Actualización parcial
export const patchProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;

    const [result] = await conmysql.query(
      `UPDATE productos 
       SET prod_codigo = IFNULL(?, prod_codigo), 
           prod_nombre = IFNULL(?, prod_nombre), 
           prod_stock = IFNULL(?, prod_stock), 
           prod_precio = IFNULL(?, prod_precio), 
           prod_activo = IFNULL(?, prod_activo), 
           prod_imagen = IFNULL(?, prod_imagen) 
       WHERE prod_id = ?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    const [rows] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error en patchProducto:", error);
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};

// 🔹 Eliminar producto
export const deleteProducto = async (req, res) => {
  try {
    const [rows] = await conmysql.query("DELETE FROM productos WHERE prod_id = ?", [req.params.id]);
    if (rows.affectedRows <= 0)
      return res.status(404).json({ message: "No se pudo eliminar el producto" });

    res.sendStatus(202);
  } catch (error) {
    console.error("Error en deleteProducto:", error);
    return res.status(500).json({ message: "Error del lado del servidor" });
  }
};
