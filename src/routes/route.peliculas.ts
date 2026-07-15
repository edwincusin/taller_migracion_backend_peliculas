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


/**
 * @swagger
 * /auth/peliculas/{id}:
 *  delete:
 *      summary: Elimina una pelicular por su ID, pasando como PARAMS
 *      tags: [peliculas]
 *      security: 
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: ID de la película que se desea eliminar
 *      responses: 
 *          200:
 *              description: Pelicula eliminada correctamente.
 *          500: 
 *              description: Error al eliminar pelicula.
 */
routerPeliculas.delete("/peliculas/:id",validarAuth,deleteMovie);

routerPeliculas.get("/peliculas/:id/foto",validarAuth,obtenerFotoId);
routerPeliculas.post("/peliculas",validarAuth,upload.single("file"),crearMovie);
routerPeliculas.put("/peliculas/:id",validarAuth,upload.single("file"),modificarMovieId);


