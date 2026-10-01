
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/situations";
import { PaginationService } from "../services/PaginationService";

const Router = express.Router();
//Lista
Router.get("/situations",async(req:Request, res:Response)=>{
      try{
      const situationRepository = AppDataSource.getRepository(Situation);

      const page = Number(req.query.page) || 1;

      const limit = Number(req.query.limit) || 10;

      const result = await PaginationService.paginate(situationRepository, page, limit,{id: "DESC"});


      res.status(200).json(result);
      return;

      }catch(error){
          console.log(error); 
          res.status(500).json({
          mensagem : "Erro ao listar situação",
       });
       return
      }

});

//Vizualização
Router.get("/situations/:id", async(req:Request, res:Response)=>{
      try{
      const { id } = req.params;

      const situationRepository = AppDataSource.getRepository(Situation);

      const situation = await situationRepository.findOneBy({id : parseInt(id)})

      if(!situation){
          res.status(404).json({
          mensagem : "Situação não encontrada",
       });
       return 
      }

      res.status(200).json(situation);
      return

      }catch(error){
          console.log(error); 
          res.status(500).json({
          mensagem : "Erro ao vizualizar a situação",
       });
       return
      }

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

//Editar
Router.put("/situations/:id", async(req:Request, res:Response)=>{
      try{
      const { id } = req.params;

      var data = req.body;

      const situationRepository = AppDataSource.getRepository(Situation);

      const situation = await situationRepository.findOneBy({id : parseInt(id)})

      if(!situation){
          res.status(404).json({
          mensagem : "Situação não encontrada",
       });
       return 
      }
      //Atualizar dados
      situationRepository.merge(situation, data);
      //Salvr dados
      const updateSituation = await situationRepository.save(situation);

      res.status(200).json({
          mensagem : "Situação atualizada com sucesso",
          situation: updateSituation
      })
  

      }catch(error){
          res.status(500).json({
          mensagem : "Erro ao atualizar situação",
       });
       return
      }

});


//Remove o item cadastrado
Router.delete("/situations/:id", async(req:Request, res:Response)=>{
      try{
      const { id } = req.params;

      const situationRepository = AppDataSource.getRepository(Situation);

      const situation = await situationRepository.findOneBy({id : parseInt(id)})

      if(!situation){
          res.status(404).json({
          mensagem : "Situação não encontrada",
       });
       return 
      }
      //Remove os dados
      await situationRepository.remove(situation);
     
      res.status(200).json({
          mensagem : "Situação removida com sucesso",
      })
  

      }catch(error){
          res.status(500).json({
          mensagem : "Erro ao atualizar situação",
       });
       return
      }

});


export default Router
