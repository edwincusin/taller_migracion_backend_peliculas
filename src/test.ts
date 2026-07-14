import "dotenv/config"; //ejecuta el código de este módulo, no necesito nada que exporte, solo quiero que corra".
import prisma from "./database/prisma.js";

const recuperar = async () => {
    const peliculas = await prisma.peliculas.findMany();
    console.log({ Peliculas: peliculas });
}

recuperar();