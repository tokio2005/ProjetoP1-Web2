import { Console } from "console";
import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";


const runSeeds = async() =>{
    console.log ("Conectando ao banco de dados...")

    await AppDataSource.initialize();
    console.log("Banco de Dados conectado!")

    try {
          //Criar as instancia da classe dos seeds
        const situationsSeeds = new CreateSituationsSeeds();

         // executar os seeds
        await situationsSeeds.run(AppDataSource);
      
    }catch (error) {
        console.log("Erro ao executar o seed:", error)
        
    }finally{
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
        
    }
};

runSeeds();
