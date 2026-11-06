
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/situations";
import { PaginationService } from "../services/PaginationService";
import * as yup from 'yup';
import { Not } from "typeorm";


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

       const schema = yup.object().shape({
         nameSituation: yup.string()
         .required("O campo nome é obrigatório!")
         .min(3, "O campo nome deve ter no minimo 3 caracteres!"),

       });

       await schema.validate(data, {abortEarly: false});

       const situationRepository = AppDataSource.getRepository(Situation);

       const existingSituation = await situationRepository.findOne({
          where : {nameSituation: data.nameSituation}
       })

       if(existingSituation){
         res.status(400).json({
          mensagem : "Já existe uma situação cadastrada com este nome!"
          });
          return;
         
       }

       const newSituation = situationRepository.create(data);

       await situationRepository.save(newSituation);
       res.status(201).json({
          mensagem : "Situação cadastrada com sucesso",
          situation: newSituation

       });


     }catch(error){
       if(error instanceof yup.ValidationError){
          res.status(400).json({
          mensagem : error.errors
          });
          return;
    }

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
       const schema = yup.object().shape({
         nameSituation: yup.string()
         .required("O campo nome é obrigatório!")
         .min(3, "O campo nome deve ter no minimo 3 caracteres!"),

       });

       await schema.validate(data, {abortEarly: false});


      const situationRepository = AppDataSource.getRepository(Situation);

      const situation = await situationRepository.findOneBy({id : parseInt(id)})

      if(!situation){
          res.status(404).json({
          mensagem : "Situação não encontrada",
       });
       return 
      }

      const existingSituation = await situationRepository.findOne({
          where : {
            nameSituation: data.nameSituation,
            id: Not(parseInt(id)),

          }
       })

       if(existingSituation){
         res.status(400).json({
          mensagem : "Já existe uma situação cadastrada com este nome!"
          });
          return;
         
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
          if(error instanceof yup.ValidationError){
          res.status(400).json({
          mensagem : error.errors
          });
          return;

        }

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
