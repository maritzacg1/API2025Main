import { Router } from "express";
import {getProductos, getProductosxId, postProductos, putProductosxId, deleteProducto} from '../controladores/productosCtrl.js'
const router=Router();

router.get('/productos',getProductos)
router.get('/productos/:id',getProductosxId)
router.post('/productos',postProductos)
router.put('/productos/:id',putProductosxId)
router.delete('/productos/:id',deleteProducto)
export default router


