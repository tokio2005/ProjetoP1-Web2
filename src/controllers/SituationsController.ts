
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/situations";

const Router = express.Router();

Router.get("/situations",(req:Request, res:Response)=>{
     res.send("Bem Vindo Usuário! tela de situações da rota")
});


Router.post("/situations",async(req:Request, res:Response)=>{
     try{
       var data = req.body;

       const situationRepository = AppDataSource.getRepository(Situation);
       const newSituation = situationRepository.create(data);

       await situationRepository.save(newSituation);
       res.status(201).json({
          mensagem : "Situação cadastrada com sucesso",
          situation: newSituation

       });


     }catch(error){
          console.log(error); 
          res.status(500).json({
          mensagem : "Erro ao cadastrar situação",
       });


     }
});

export default Router
