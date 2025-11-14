import { Router } from "express";
import multer from 'multer';
import upload from '../middlewares/upload.js'
import {
    getProductos, 
    getproductosxid,
    postProducto,
    putProducto,
    patchProducto,
    deleteProducto
} from '../controladores/productosCtrl.js';

import { verifyToken } from "../jwt/verifytoken.js"; // 🔐 importa el middleware

// Configurar multer para almacenar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploads = multer({ storage });
const router = Router();

// 🧩 Rutas protegidas con verifyToken
router.get('/', getProductos);       // select
router.get('/:id', getproductosxid); // select por id

// 🔓 Rutas abiertas (puedes protegerlas también si quieres)
router.get('/productos',getProductos)
router.get('/productos/:id',getProductosxId)
router.post('/productos',postProductos)
router.put('/productos/:id',putProductosxId)
router.delete('/productos/:id',deleteProducto)
export default router
