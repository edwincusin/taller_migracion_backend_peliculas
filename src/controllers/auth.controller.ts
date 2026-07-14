import type { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import prisma from "../database/prisma.js";

//LOGGIN
export const login=async(req:Request, res:Response)=>{
    //capturamos lo que viene en el resq
    const {username, password}=req.body;

    try {
        //capturamos si existe usuario 
        const usuario=await prisma.usuarios.findFirst({
            where:{user_name:username}
        })

        //validamos si existe usuario
        if(!usuario){
          return  res.status(401).json({mensaje:"Usuario o contraseñas incorrectas"})
        }

        //validamos en comparacion si las paswword son iguales
        const passwordCorrecto=await bcrypt.compare(password,usuario.password);
        //si es falso retona mensaje
        if(!passwordCorrecto){
            return res.status(401).json({mensaje:"Usuario o contraseñas incorrectas"})
        }
        //generamos el token Header (Cabecera)/ Payload (Datos) /Signature (Firma) -tiempo de expiracion
        const token=jwt.sign(
            {id:usuario.id, username:usuario.user_name},
            process.env.JWT_SECRET || "secreta",
            {expiresIn:"2h"}
        )

        res.json({token})

    } catch (error) {
        res.status(500).json({error:"error en el servidor al logear y generar el token"})
    }
}