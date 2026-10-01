import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/categories";
import { PaginationService } from "../services/PaginationService";

const Router = express.Router();

// Lista paginada: GET /categories?page=1&limit=10
Router.get("/categories", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Category);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(repository, page, limit, { id: "DESC" });
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar categorias." });
        return;
    }
});

// Visualizar: GET /categories/:id
Router.get("/categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Category);
        const category = await repository.findOneBy({ id: Number(req.params.id) });

        if (!category) {
            res.status(404).json({ message: "Categoria não encontrada." });
            return;
        }
        res.status(200).json(category);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar categoria." });
        return;
    }
});

// Cadastrar: POST /categories
Router.post("/categories", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({ message: "O campo name é obrigatório." });
            return;
        }

        const repository = AppDataSource.getRepository(Category);
        const category = await repository.save(repository.create({ name: name.trim() }));

        res.status(201).json({ message: "Categoria cadastrada com sucesso!", category });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar categoria." });
        return;
    }
});

// Editar: PUT /categories/:id
Router.put("/categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Category);
        const category = await repository.findOneBy({ id: Number(req.params.id) });

        if (!category) {
            res.status(404).json({ message: "Categoria não encontrada." });
            return;
        }

        const { name } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({ message: "O campo name é obrigatório." });
            return;
        }

        category.name = name.trim();
        await repository.save(category);

        res.status(200).json({ message: "Categoria atualizada com sucesso!", category });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar categoria." });
        return;
    }
});

// Excluir: DELETE /categories/:id
Router.delete("/categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Category);
        const category = await repository.findOneBy({ id: Number(req.params.id) });

        if (!category) {
            res.status(404).json({ message: "Categoria não encontrada." });
            return;
        }

        await repository.remove(category);
        res.status(200).json({ message: "Categoria excluída com sucesso!" });
        return;
    } catch (error: any) {
        // 1451 = existe produto vinculado (FK RESTRICT)
        if (error?.errno === 1451) {
            res.status(409).json({ message: "Não é possível excluir: existem produtos nesta categoria." });
            return;
        }
        res.status(500).json({ message: "Erro ao excluir categoria." });
        return;
    }
});

export default Router;