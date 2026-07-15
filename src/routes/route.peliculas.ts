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

/**
 * @swagger
 * /auth/peliculas/{id}:
 *  put:
 *      summary: Edita una pelicular por su ID, pasando como PARAMS en el path
 *      tags: [peliculas]
 *      security: 
 *          - bearerAuth: [] 
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: ID de la película que se desea modificar
 *      requestBody:
 *          required: true
 *          content: 
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          titulo:
 *                              type: string
 *                          genero:
 *                              type: string
 *                          sinopis:
 *                              type: string
 *                          file:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:    
 *              description: Modificacion exitosa.
 *          404: 
 *              description: No existe pelicula con tal ID para modificar.
 *          500: 
 *              description: Error al modificar pelicula.
 */
routerPeliculas.put("/peliculas/:id",validarAuth,upload.single("file"),modificarMovieId);

/**
 * @swagger
 * /auth/peliculas:
 *   post:
 *     summary: Crear o guarda nuevo registro de pelicula
 *     tags: [peliculas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               genero:
 *                 type: string
 *               sinopsis:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Creacion exitosa.
 *       400:
 *         description: El campo de la imagen debe completarse, es obligatorio.
 *       500:
 *         description: Error al guardar nueva pelicula. 
 */
routerPeliculas.post("/peliculas",validarAuth,upload.single("file"),crearMovie);

routerPeliculas.get("/peliculas/:id/foto",validarAuth,obtenerFotoId);


