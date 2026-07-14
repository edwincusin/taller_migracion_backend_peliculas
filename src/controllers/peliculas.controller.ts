import type { Request, Response } from "express";
import prisma from "../database/prisma.js";
import multer from "multer";

//ENDPOINT DELETE
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existeMovie = await prisma.peliculas.findUnique({
      where: { id: Number(id) },
    });

    if (!existeMovie) {
      return res
        .status(404)
        .json({ mensaje: "No existe pelicula para eliminar" });
    }

    await prisma.peliculas.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ Mensaje: "Pelicular eliminado" });
  } catch (error) {
    console.log({ error: error, mensaje: "error al eliminar perlicula" });
    res.status(500).json({ mensaje: "error al eliminar pelicular: " });
  }
};

//ENDPOINT LISTAR
export const listarMovies = async (req: Request, res: Response) => {
  try {
    const peliculas = await prisma.peliculas.findMany({
      select: {
        id: true,
        genero: true,
        mime_type: true,
        sinopis: true,
        titulo: true,
      },
    });
    res.status(200).json(peliculas);
  } catch (error) {
    console.log({ error: error, mensaje: "error al listar peliculas" });
    res.status(500).json({ mensaje: "error al listar peliculas " });
  }
};

//ENDPOINT OBTNER FOTO VEHICULO
export const obtenerFotoId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pelicula = await prisma.peliculas.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!pelicula) {
      return res.status(404).json({ mensaje: "pelicula no encontrado" });
    }
    if (pelicula.mime_type === null || pelicula.foto === null) {
      return res.status(404).json({ mensaje: "formato imagen no soportada" });
    }
    res.setHeader("Content-Type", pelicula.mime_type);
    res.send(pelicula.foto);
  } catch (error) {
    console.log({ error: error, mensaje: "error al obtner foto peliculas" });
    res.status(500).json({ Mensaje: "error al obtenr foto peliculas " });
  }
};

//ENDPOINT EDITAR PELICULA
export const modificarMovieId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { genero, sinopis, titulo } = req.body; //nuevos datos
    const archivo = req.file;

    const pelicula = await prisma.peliculas.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!pelicula) {
      return res
        .status(404)
        .json({ Mensaje: "pelicula no encontrado para modificar" });
    }

    let bufferFinal: Uint8Array | null;
    let mimeTypeFinal: string | null;

    if (!archivo) {
      // No mandaron foto nueva -> conservar la existente
      bufferFinal = pelicula.foto;
      mimeTypeFinal = pelicula.mime_type;
    } else {
      // Mandaron foto nueva -> usar la del archivo subido
      bufferFinal = archivo.buffer;
      mimeTypeFinal = archivo.mimetype;
    }

    const nuevaMovie = await prisma.peliculas.update({
      where: { id: Number(id) },
      data: {
        genero,
        sinopis,
        titulo,
        mime_type: mimeTypeFinal,
        foto: bufferFinal,
      },
    });
    res.status(200).json({ Mensaje: "Pelicula modificada con exito" });
  } catch (error) {
    console.log({ error: error, mensaje: "error al editar  peliculas" });
    res.status(500).json({ Mensaje: "error al editar  peliculas " });
  }
};

//ENDPOINT CREAR PELICULA
export const crearMovie = async (req: Request, res: Response) => {
  try {
    const { genero, sinopis, titulo } = req.body; //nuevos datos
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: "debe seleccionar una imagen" });
    }

    const nuevaMovie = await prisma.peliculas.create({
      data: {
        genero,
        sinopis,
        titulo,
        mime_type: archivo.mimetype,
        foto: archivo.buffer,
      },
    });
    res.status(201).json({ Mensaje: "Pelicula registrada con exito" });
  } catch (error) {
    console.log({ error: error, mensaje: "error al crear  peliculas" });
    res.status(500).json({ Mensaje: "error al crear  peliculas " });
  }
};
