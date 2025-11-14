import { Router } from "express";
import {
  getobetenerClientes,
  getClientesxId,
  getClientePorCedula, // ✅ nuevo
  postClientes,
  putClientes,
  deleteClientes,
} from "../controladores/clientesCtrl.js";

import { verifyToken } from "../jwt/verifytoken.js";

const router = Router();

// ✅ Ruta nueva para buscar por cédula
router.get("/cedula/:cedula",  getClientePorCedula);

// ✅ Rutas existentes
router.get('/clientes',verificarToken,getClientes)
router.get('/clientes/:id',getClientesxId)
router.post('/clientes',postClientes)   
router.put('/clientes/:id',putClientesxId)
router.delete('/clientes/:id',deleteCliente)
export default router

