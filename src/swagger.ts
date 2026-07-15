import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import type{ Application } from "express";

// configuracion 

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"API de Gestion Peliculas",
            version:"1.0.0",
            description:"Documentacion de uso de la API REST de gestion peliculas con todos los metodos disponibles"
        },
        components:{
        securitySchemes:{
            bearerAuth:{
                type:"http",
                scheme:"bearer",
                bearerFormat:"JWT"
            }
        }
    }

    },
    apis:["./src/routes/*.ts"]
}
// swagger-jsdoc lee esos comentarios y devuelve un objeto JSON (la especificación)
const swaggerSpec=swaggerJSDoc(options);

export const swaggerDocs=(app:Application, port:number)=>{
    app.use("/api-docs",SwaggerUi.serve,SwaggerUi.setup(swaggerSpec));
    console.log(`Documentacion disponible en http://localhost:${port}/api-docs` )
}