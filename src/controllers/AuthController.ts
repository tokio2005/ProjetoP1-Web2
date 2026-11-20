
import express, {Request, Response} from "express";
import { AuthService } from "../services/AuthService";
import { AppDataSource } from "../data-source";
import { User} from "../entity/users";
import * as yup from 'yup';
import crypto from "crypto";


const Router = express.Router();

Router.post("/", async(req:Request, res:Response)=>{
     try{
          const {email, password} = req.body;
          if(!email || !password){ 
          res.status(400).json({
          message: "Email e senha são obrigatório!",

     });
     return;
      }

      const authService = new AuthService();

      const userData = await authService.login(email, password)


     res.status(200).json({
     message: "login realizado com sucesso!",
     user: userData
     });

     return;


   } catch (error) {
    console.log(error);
    return res.status(401).json({ 
        message: "Erro ao realizar o login!" });
    }


    
    })

    Router.post("/recover-password", async (req: Request, res: Response) => {
    try {
        // Receber os dados enviados no corpo da requisição
        var data = req.body;

        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("A URL é obrigatória"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
        });

        await schema.validate(data, {abortEarly: false});

        const userRepository = AppDataSource.getRepository(User);

        
       const user = await userRepository.findOneBy({email: data.email});

         if(!user){
         res.status(404).json({
          mensagem : "Usuário não encontrado"
          });
          return;
         
       }
       user.recoverPassword = crypto.randomBytes(32).toString("hex");

       await userRepository.save(user);

        res.status(200).json({
          mensagem : "Gerado o link para recuperar a senha!",
          urlRecoverPassword: `${data.urlRecoverPassword}email=${data.email}}&key{user.recoverPassword}`,
          key: user.recoverPassword,

       });

    } catch (error: any) {
        // Retornar erro em caso de falha
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
                message: "Erro ao editar usuário!",
            });
            return;
    }

})

export default Router
