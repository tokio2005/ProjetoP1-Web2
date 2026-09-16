
import express, {Request, Response} from "express";

const Router = express.Router();

Router.get("/",(req:Request, res:Response)=>{
     res.send("Bem Vindo Usuário! tela de login")
})

export default Router
