
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { User} from "../entity/users";
import { PaginationService } from "../services/PaginationService";
import * as yup from 'yup';
import { Not } from "typeorm";
import bcrypt from "bcryptjs";
import {verifyToken} from "../middlewares/authMiddleware";

const Router = express.Router();

Router.get("/users", verifyToken,async(req:Request, res:Response)=>{
      try{
      const situationRepository = AppDataSource.getRepository(User);

      const page = Number(req.query.page) || 1;

      const limit = Number(req.query.limit) || 10;

      const result = await PaginationService.paginate(situationRepository, page, limit,{id: "DESC"} , { situation: true } );


      res.status(200).json(result);
      return;

      }catch(error){
          console.log(error); 
          res.status(500).json({
          mensagem : "Erro ao listar os usuários",
       });
       return
      }

});

Router.get("/users/:id", verifyToken,async(req:Request, res:Response)=>{
      try{
      const { id } = req.params;

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
          relations: { situation: true },         
          where:{id : parseInt(id)}
      
      });

      if(!User){
          res.status(404).json({
          mensagem : "Usuário não encontrado",
       });
       return 
      }

      res.status(200).json(user);
      return

      }catch(error){
          console.log(error); 
          res.status(500).json({
          mensagem : "Erro ao vizualizar o usuário",
       });
       return
      }

});

Router.post("/users",verifyToken,async(req:Request, res:Response)=>{
     try{
       var data = req.body;

       const schema = yup.object().shape({
         name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no minimo 3 caracteres!"),
         email: yup.string().email("Email inválido!").required("O campo email é obrigatório"),
         situation: yup.number().required("O campo situação é obrigatório!")

       });

       await schema.validate(data, {abortEarly: false});

       const userRepository = AppDataSource.getRepository(User);

       const existingUser = await userRepository.findOne({
          where : {email: data.email}
       })

       if(existingUser){
         res.status(400).json({
          mensagem : "Já existe um usuário cadastrado com este email!"
          });
          return;
         
       }
       data.password = await bcrypt.hash(data.password, 10)

       const newUser = userRepository.create(data);

       await userRepository.save(newUser);
       res.status(201).json({
          mensagem : "Usuário cadastrado com sucesso",
          situation: newUser

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
          mensagem : "Erro ao cadastrar usuário",
       });


     }
});


//Criptografia
Router.put("/users-password/:id", verifyToken,async(req:Request, res:Response)=>{
      try{
      const { id } = req.params;

      var data = req.body;
      const schema = yup.object().shape({
         password: yup.string().required("O campo senha é obrigatório!").min(6,"A senha deve ter no minimo 6 caracteres")
       })

       await schema.validate(data, {abortEarly: false});


      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({id : parseInt(id)})

      if(!user){
          res.status(404).json({
          mensagem : "Usuário não encontrado",
       });
       return 
      }
       
      data.password = await bcrypt.hash(data.password, 10)

   
      userRepository.merge(user, data);
      //Salvr dados
      const updateUser = await userRepository.save(user);

      res.status(200).json({
          mensagem : "senha do usuário atualizada com sucesso",
          situation: updateUser
      })
  

      }catch(error){
          if(error instanceof yup.ValidationError){
          res.status(400).json({
          mensagem : error.errors
          });
          return;

        }

          res.status(500).json({
          mensagem : "Erro ao editar senha do usuário",
       });
       return
      }

});

Router.put("/users/:id", async(req:Request, res:Response)=>{
      try{
      const { id } = req.params;

      var data = req.body;
      const schema = yup.object().shape({
         name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no minimo 3 caracteres!"),
         email: yup.string().email("Email inválido!").required("O campo email é obrigatório"),
         situation: yup.number().required("O campo situação é obrigatório!")

       })

       await schema.validate(data, {abortEarly: false});


      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({id : parseInt(id)})

      if(!user){
          res.status(404).json({
          mensagem : "Usuário não encontrado",
       });
       return 
      }

      const existingUser = await userRepository.findOne({
          where : {
            email: data.email,
            id: Not(parseInt(id)),

          }
       })

       if(existingUser){
         res.status(400).json({
          mensagem : "Já existe uma usuário cadastrado com este nome!"
          });
          return;
         
       }    
      //Atualizar dados
      userRepository.merge(user, data);
      //Salvr dados
      const updateUser = await userRepository.save(user);

      res.status(200).json({
          mensagem : "Usuaário atualizada com sucesso",
          situation: updateUser
      })
  

      }catch(error){
          if(error instanceof yup.ValidationError){
          res.status(400).json({
          mensagem : error.errors
          });
          return;

        }

          res.status(500).json({
          mensagem : "Erro ao atualizar usuário",
       });
       return
      }

});

Router.delete("/users/:id", async(req:Request, res:Response)=>{
      try{
      const { id } = req.params;

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({id : parseInt(id)})

      if(!user){
          res.status(404).json({
          mensagem : "Usuário não encontrado",
       });
       return 
      }
      //Remove os dados
      await userRepository.remove(user);
     
      res.status(200).json({
          mensagem : "Usuário removido com sucesso",
      })
  

      }catch(error){
          res.status(500).json({
          mensagem : "Erro ao atualizar usuário",
       });
       return
      }

});
export default Router;

 