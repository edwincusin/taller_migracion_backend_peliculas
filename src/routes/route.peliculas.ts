import { Router } from "express";
import { validarAuth } from "../middleware/auth.middleware.js";
import multer from "multer";
import { crearMovie, listarMovies,deleteMovie,modificarMovieId,obtenerFotoId } from "../controllers/peliculas.controller.js";

export const routerPeliculas=Router();

const upload=multer({storage:multer.memoryStorage()});



/**
 * @swagger
 * /auth/peliculas:
 *  get:
 *      summary: Obtiene toda la lista completa de las peliculas.
 *      tags: [peliculas]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Lista de todas las peliculas.
 *          500:
 *              description: Error al listar peliculas.
 */
routerPeliculas.get("/peliculas",validarAuth,listarMovies);

routerPeliculas.get("/peliculas/:id/foto",validarAuth,obtenerFotoId);
routerPeliculas.post("/peliculas",validarAuth,upload.single("file"),crearMovie);
routerPeliculas.put("/peliculas/:id",validarAuth,upload.single("file"),modificarMovieId);
routerPeliculas.delete("/peliculas/:id",validarAuth,deleteMovie);

