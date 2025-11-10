import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar las rutas
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';

// Definir los módulos de entrada
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Configurar CORS correctamente
const corsOptions = {
  origin: [
    "http://localhost:8100",
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "https://api2025main.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));


// Crear instancia de Express
const app = express();

// Aplicar middlewares
app.use(express.json()); // interpretar objetos JSON
app.use(express.urlencoded({ extended: true })); // para formularios

// Servir archivos estáticos (imágenes, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas principales
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', pedidosRoutes);

// Ruta por defecto (404)
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default app;
