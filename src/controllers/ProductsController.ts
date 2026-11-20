import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/products";
import { Category } from "../entity/categories";
import { ProductSituation } from "../entity/productSituations";
import { PaginationService } from "../services/PaginationService";
import { SlugService } from "../services/SlugService";

const Router = express.Router();

// Lista paginada: GET /products?page=1&limit=10
Router.get("/products", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(
            repository, page, limit, { id: "DESC" }, { category: true, situation: true }
        );
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar produtos." });
        return;
    }
});

// Visualizar: GET /products/:id
Router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOne({
            where: { id: Number(req.params.id) },
            relations: { category: true, situation: true },
        });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrado." });
            return;
        }
        res.status(200).json(product);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produto." });
        return;
    }
});

// Valida o corpo e a existência das chaves estrangeiras.
// Retorna a mensagem de erro, ou null se estiver tudo certo.
async function validate(body: any): Promise<string | null> {
    const { name, description, price, productSituationId, productCategoryId } = body;

    if (!name || typeof name !== "string" || !name.trim()) return "O campo name é obrigatório.";
    if (description !== undefined && description !== null && typeof description !== "string") {
        return "O campo description deve ser um texto.";
    }
    if (price === undefined || price === null || price === "" || isNaN(Number(price)) || Number(price) < 0) {
        return "O campo price é obrigatório e deve ser um número maior ou igual a zero.";
    }
    if (!Number.isInteger(productSituationId)) return "productSituationId deve ser um número inteiro.";
    if (!Number.isInteger(productCategoryId)) return "productCategoryId deve ser um número inteiro.";

    const situation = await AppDataSource.getRepository(ProductSituation).findOneBy({ id: productSituationId });
    if (!situation) return "Situação informada não existe.";

    const category = await AppDataSource.getRepository(Category).findOneBy({ id: productCategoryId });
    if (!category) return "Categoria informada não existe.";

    return null;
}

// Cadastrar: POST /products
// O slug é opcional: se não vier no corpo, é gerado a partir do name.
Router.post("/products", async (req: Request, res: Response) => {
    try {
        const error = await validate(req.body);
        if (error) {
            res.status(400).json({ message: error });
            return;
        }

        const { name, slug, description, price, productSituationId, productCategoryId } = req.body;
        const repository = AppDataSource.getRepository(Product);

        const finalSlug = await SlugService.generateUnique(
            repository,
            typeof slug === "string" && slug.trim() ? slug : name
        );

        const product = await repository.save(
            repository.create({
                name: name.trim(),
                slug: finalSlug,
                description: description ?? null,
                price: Number(price),
                productSituationId,
                productCategoryId,
            })
        );

        res.status(201).json({ message: "Produto cadastrado com sucesso!", product });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar produto." });
        return;
    }
});

// Editar: PUT /products/:id
Router.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOneBy({ id: Number(req.params.id) });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrado." });
            return;
        }

        const error = await validate(req.body);
        if (error) {
            res.status(400).json({ message: error });
            return;
        }

        const { name, slug, description, price, productSituationId, productCategoryId } = req.body;

        const finalSlug = await SlugService.generateUnique(
            repository,
            typeof slug === "string" && slug.trim() ? slug : name,
            product.id
        );

        repository.merge(product, {
            name: name.trim(),
            slug: finalSlug,
            description: description ?? null,
            price: Number(price),
            productSituationId,
            productCategoryId,
        });
        await repository.save(product);

        res.status(200).json({ message: "Produto atualizado com sucesso!", product });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar produto." });
        return;
    }
});

// Excluir: DELETE /products/:id
Router.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOneBy({ id: Number(req.params.id) });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrado." });
            return;
        }

        await repository.remove(product);
        res.status(200).json({ message: "Produto excluído com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir produto." });
        return;
    }
});

export default Router;