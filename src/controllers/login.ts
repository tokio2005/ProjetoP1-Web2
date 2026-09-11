
import express, {Request, Response} from "express";

import { AppDataSource } from "../data-souce";

AppDataSource.initialize().then(()=>{
     console.log("Conexão de Banco de Dados realizado com sucesso")
}).catch((Error)=>{
     
     console.log("Erro na Conexão com o Banco de Dados ")   
})

const Router = express.Router();

Router.get("/",(req:Request, res:Response)=>{
     res.send("Bem Vindo Usuário! tela de login         ")
})

export default Router
