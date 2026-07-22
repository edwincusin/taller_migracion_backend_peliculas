import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";

//LOGGIN
export const login = async (req: Request, res: Response) => {
  //capturamos lo que viene en el resq
  const { username, password } = req.body;

  try {
    //capturamos si existe usuario
    const usuario = await prisma.usuarios.findFirst({
      where: { user_name: username },
    });

    //validamos si existe usuario
    if (!usuario) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseñas incorrectas" });
    }

    //validamos en comparacion si las paswword son iguales
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    //si es falso retona mensaje
    if (!passwordCorrecto) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseñas incorrectas" });
    }
    //generamos el token Header (Cabecera)/ Payload (Datos) /Signature (Firma) -tiempo de expiracion
    const token = jwt.sign(
      { id: usuario.id, username: usuario.user_name },
      process.env.JWT_SECRET || "secreta",
      { expiresIn: "2h" },
    );

    const expires_at = new Date(Date.now() + 120 * 1000);
    await prisma.revoked_token.create({
      data: {
        token,
        expires_at,
      },
    });

    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "error en el servidor al logear y generar el token" });
  }
};

//LOGOUT
export const logout = async (req: Request, res: Response) => {
  // Tomamos el header "Authorization"
  const autHeader = req.headers.authorization;
  // Sacamos solo el token, quitando la palabra "Bearer"
  const token = autHeader && autHeader.split(" ")[1];

    // Si no vino token, cortamos con 404
  if (!token) {
    return res.status(404).json({ Mensaje: "NO EXSITE TOKEN PARA CERRAR" });
  }
     try {
        await prisma.revoked_token.deleteMany({
            where:{
                token
            }
        })

        res.status(200).json({Mensaje:"SESION CERRADA EXITOSAMENTE"})
     } catch (error) {
        res.status(500).json({Mensaje:"ERROR AL CERRAR SESION"})
     }

};
