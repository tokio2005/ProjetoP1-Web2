// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { User } from "../entity/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// Classe responsável pela autenticação do usuário
export class AuthService{

    // Criar um repositório para manipular a tabela `User` no banco de dados
    private userRepository = AppDataSource.getRepository(User);

    /**
     * Método para autenticar um usuário com e-mail e senha
     * @param email - E-mail do usuário
     * @param password - Senha do usuário
     * @returns Dados do usuário autenticado e token de acesso
     * @throws Erro caso as credenciais sejam inválidas
     */

    async login(email: string, password: string): Promise<{id: number; name: string; email: string; token: string}>{
     const user = await this.userRepository.findOne({where:{email}})
     console.log("USER:", user);

     if(!user){
        throw new Error("Usuário ou senha inválidos!")
     }
     const isPasswordValid = await user.comparePassword(password);
     console.log("SENHA VALIDA:", isPasswordValid);
     if(!isPasswordValid){
        throw new Error("Usuário ou senha inválidos!")
     }

     const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn:"7d"})

     return{id: user.id, name: user.name, email: user.email, token  }

    }

}