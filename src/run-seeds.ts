import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateProductSituationsSeeds from "./seeds/CreateProductSituationsSeeds";
import CreateCategoriesSeeds from "./seeds/CreateCategoriesSeeds";
import CreateProductsSeeds from "./seeds/CreateProductsSeeds";

const runSeeds = async () => {
    console.log("Conectando ao banco de dados...");

    await AppDataSource.initialize();
    console.log("Banco de Dados conectado!");

    try {
        // Criar as instâncias da classe dos seeds
        const situationsSeeds = new CreateSituationsSeeds();
        const productSituationsSeeds = new CreateProductSituationsSeeds();
        const categoriesSeeds = new CreateCategoriesSeeds();
        const productsSeeds = new CreateProductsSeeds();

        // Executar os seeds (a ordem importa por causa das chaves estrangeiras)
        await situationsSeeds.run(AppDataSource);
        await productSituationsSeeds.run(AppDataSource);
        await categoriesSeeds.run(AppDataSource);
        await productsSeeds.run(AppDataSource);
    } catch (error) {
        console.log("Erro ao executar o seed:", error);
    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
    }
};

runSeeds();