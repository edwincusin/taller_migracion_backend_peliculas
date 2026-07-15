import express from 'express'
import cors from 'cors'

import { routerLogin } from './routes/route.auth.js'
import { routerPeliculas } from './routes/route.peliculas.js'

import { swaggerDocs } from './swagger.js'


const app=express();

const PORT=3000;

app.use(cors());
app.use(express.json());

app.use("/auth",routerLogin);
app.use("/auth",routerPeliculas);
swaggerDocs(app,PORT);

app.listen(PORT,()=>{
    console.log("SERVICIO INICIADO PORT: "+PORT);
    
})
