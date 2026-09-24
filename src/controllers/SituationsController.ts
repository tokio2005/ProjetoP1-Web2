
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/situations";

const Router = express.Router();
//Lista
Router.get("/situations",async(req:Request, res:Response)=>{
      try{
      const situationRepository = AppDataSource.getRepository(Situation);

      const page = Number(req.query.page) || 1;

      const limit = 1;

      const totalSituations = await situationRepository.count();

      if(totalSituations === 0){
        res.status(400).json({
          mensagem : "Nenhuma situação encontrada",
       });
       return
      }
      const lastPage = Math.ceil(totalSituations /limit)

      if (page > lastPage){
        res.status(400).json({
          mensagem : `Página inválida. O total de página são ${lastPage}`,
       });
       return

      }

      const offset = (page - 1) * limit;

      const situations = await situationRepository.find({
        take: limit,
        skip: offset,
        order: {id: "DESC"}
      });

      res.status(200).json({
        currentPage: page,
        lastPage,
        totalSituations,
        situations,    
      });
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
