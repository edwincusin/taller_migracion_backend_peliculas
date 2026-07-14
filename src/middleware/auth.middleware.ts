import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken"; // libraria para verificar el token

// Molde de Request de Express + un campo extra "usuario"
export interface CustomRequest extends Request {
  usuario?: any;
}

// Middleware que se ejecuta antes del controlador para validar el token
export const validarAuth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  // Tomamos el header "Authorization"
  const autHeader = req.headers.authorization;

  // Sacamos solo el token, quitando la palabra "Bearer"
  const token = autHeader && autHeader.split(" ")[1];

  // Si no vino token, cortamos con 401
  if (!token) {
    return res.status(401).json({ error: "ACCESO DENEGADO" });
  }

  try {
    // Verificamos firma y expiración del token
    const verificado = jwt.verify(token, process.env.JWT_SECRET || "secreto");

    // Guardamos el payload decodificado en el request
    req.usuario = verificado;

    // Dejamos pasar la petición hacia el controlador
    next();
  } catch (error) {
    // Token inválido o expirado -> 403
    res.status(403).json({ error: "TOKEN INVALIDADO O ESPIRADO" });
  }
};
