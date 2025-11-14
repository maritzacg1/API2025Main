import { Router } from "express";
//importar las funciones
import {/* prueba, */ getClientes, getClientesxId, postClientes, putClientesxId, deleteCliente} from '../controladores/clientesCtrl.js'
import { verificarToken } from "../middlewares/verificarToken.js";
const router=Router();
//armar las rutas
/* router.get('/clientes',prueba) */
router.get('/clientes',verificarToken,getClientes)
router.get('/clientes/:id',getClientesxId)
router.post('/clientes',postClientes)   
router.put('/clientes/:id',putClientesxId)
router.delete('/clientes/:id',deleteCliente)
export default router