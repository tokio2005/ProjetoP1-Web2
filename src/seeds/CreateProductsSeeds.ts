import { DataSource } from "typeorm";
import { Product } from "../entity/products";
import { ProductSituation } from "../entity/productSituations";
import { Category } from "../entity/categories";

export default class CreateProductsSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'products'...");

        const productRepository = dataSource.getRepository(Product);

        const existingCount = await productRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const situations = await dataSource.getRepository(ProductSituation).find({ order: { id: "ASC" } });
        const categories = await dataSource.getRepository(Category).find({ order: { id: "ASC" } });

        if (situations.length === 0 || categories.length === 0) {
            throw new Error("Cadastre as situações de produtos e as categorias antes de cadastrar os produtos.");
        }

        // 25 produtos para facilitar o teste da paginação
        const products = Array.from({ length: 25 }, (_, i) => ({
            name: `Produto ${i + 1}`,
            productSituationId: situations[i % situations.length].id,
            productCategoryId: categories[i % categories.length].id,
        }));

        await productRepository.save(products);

        console.log("Seed concluído com sucesso: produtos cadastrados!");
    }
}