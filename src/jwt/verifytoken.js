import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

// Token estático por defecto (tu token actual)eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9


const DEFAULT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXN1YXJpbyI6Im1hcml0emEiLCJjb3JyZW8iOiJtaWNvcnJlb0Bkb21pbmlvLmNvbSIsImlhdCI6MTc2MzA3ODI3NSwiZXhwIjoxNzYzMDg1NDc1fQ.dxdkYkUM1OwGy0C0LEm24vI46Lp4EDC_It60IoMnq98";

export const verifyToken = async (req, res, next) => {
    let token;

    // Obtener token del header "Authorization"
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        // Si no se envía, usar el token fijo
        token = DEFAULT_TOKEN;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET || 'tu_secreto_super_seguro');
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: "Token inválido o expirado" 
        });
    }
};
