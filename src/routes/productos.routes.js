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
import { verifyToken } from "../jwt/verifytoken.js";

// Configurar multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const uploads = multer({ storage });

const router = Router();

// ✅ Aquí ya no repitas /productos
router.get('/', verifyToken, getProductos);
router.get('/:id', verifyToken, getproductosxid);
router.post('/', verifyToken, upload.single('prod_imagen'), postProducto);
router.put('/:id', verifyToken, upload.single('prod_imagen'), putProducto);
router.patch('/:id', verifyToken, patchProducto);
router.delete('/:id', verifyToken, deleteProducto);

export default router;
