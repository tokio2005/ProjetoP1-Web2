
    import express from "express";

    import dotenv from "dotenv";
    dotenv.config()
import { AppDataSource } from "./data-source";

    const app = express();

    app.use(express.json());

    //Incluir os controller
    import AuthController from"./controllers/AuthController";
    import SituationsController from"./controllers/SituationsController";

    app.use('/', AuthController)
    app.use('/', SituationsController)


    app.listen(process.env.PORT, ()=>{
        console.log(`Servidor iniciado na porta $ {process.env.PORT}: http://localhost:${process.env.PORT}`)
    });