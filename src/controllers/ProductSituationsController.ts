import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/productSituations";
import { PaginationService } from "../services/PaginationService";

const Router = express.Router();

// Lista paginada: GET /product-situations?page=1&limit=10
Router.get("/product-situations", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(repository, page, limit, { id: "DESC" });
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar situações." });
        return;
    }
});

// Visualizar: GET /product-situations/:id
Router.get("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id: Number(req.params.id) });

        if (!situation) {
            res.status(404).json({ message: "Situação não encontrada." });
            return;
        }
        res.status(200).json(situation);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar situação." });
        return;
    }
});

// Cadastrar: POST /product-situations
Router.post("/product-situations", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({ message: "O campo name é obrigatório." });
            return;
        }

        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.save(repository.create({ name: name.trim() }));

        res.status(201).json({ message: "Situação cadastrada com sucesso!", situation });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar situação." });
        return;
    }
});

// Editar: PUT /product-situations/:id
Router.put("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id: Number(req.params.id) });

        if (!situation) {
            res.status(404).json({ message: "Situação não encontrada." });
            return;
        }

        const { name } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({ message: "O campo name é obrigatório." });
            return;
        }

        situation.name = name.trim();
        await repository.save(situation);

        res.status(200).json({ message: "Situação atualizada com sucesso!", situation });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar situação." });
        return;
    }
});

// Excluir: DELETE /product-situations/:id
Router.delete("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id: Number(req.params.id) });

        if (!situation) {
            res.status(404).json({ message: "Situação não encontrada." });
            return;
        }

        await repository.remove(situation);
        res.status(200).json({ message: "Situação excluída com sucesso!" });
        return;
    } catch (error: any) {
        // 1451 = existe produto vinculado (FK RESTRICT)
        if (error?.errno === 1451) {
            res.status(409).json({ message: "Não é possível excluir: existem produtos com esta situação." });
            return;
        }
        res.status(500).json({ message: "Erro ao excluir situação." });
        return;
    }
});

export default Router;