import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken"; // libraria para verificar el token
import prisma from "../database/prisma.js";

// Molde de Request de Express + un campo extra "usuario"
export interface CustomRequest extends Request {
  usuario?: any;
}

// Middleware que se ejecuta antes del controlador para validar el token
export const validarAuth = async (
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
    return res.status(401).json({ Mensaje: "ACCESO DENEGADO" });
  }

  try {
    // Verificamos firma y expiración del token
    const verificado = jwt.verify(token, process.env.JWT_SECRET || "secreto");

    const tokenObtenido=  await prisma.revoked_token.findFirst({
      where:{token}
    })

    if(!tokenObtenido){
      return res.status(401).json({ Mensaje: "TOKEN IVALIDANDO" });
    }

    // Guardamos el payload decodificado en el request
    req.usuario = verificado;

    // Dejamos pasar la petición hacia el controlador
    next();
  } catch (error) {
    // Token inválido o expirado -> 403
    res.status(403).json({ Mensaje: "TOKEN INVALIDADO O ESPIRADO" });
  }
};
