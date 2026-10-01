import { DataSource } from "typeorm";
import { Category } from "../entity/categories";

export default class CreateCategoriesSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'product_categories'...");

        const categoryRepository = dataSource.getRepository(Category);

        const existingCount = await categoryRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'product_categories' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const categories = [
            { name: "Eletrônicos" },
            { name: "Livros" },
            { name: "Roupas" },
            { name: "Alimentos" },
        ];

        await categoryRepository.save(categories);

        console.log("Seed concluído com sucesso: categorias cadastradas!");
    }
}