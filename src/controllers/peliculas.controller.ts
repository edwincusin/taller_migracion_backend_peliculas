import type { Request, Response  } from "express";
import prisma from "../database/prisma.js";

//ENDPOINT DELETE
export const deleteMovie=async(req:Request, res:Response)=>{

    try {
        const {id}=req.params;

        const existeMovie=await prisma.peliculas.findUnique({
            where:{id:Number(id)}
        })

        if(!existeMovie){
            return res.status(404).json({mensaje:"No existe pelicula para eliminar"})
        }

        await prisma.peliculas.delete({
            where:{id:Number(id)}
        })
        res.status(200).json({mensaje:"Pelicular eliminado"})
        
    } catch (error) {
        console.log({error:error, mensaje:"error al eliminar perlicula"})
        res.status(500).json({mensaje:"error al eliminar pelicular: "})        
    }   
    
}
