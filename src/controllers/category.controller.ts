import type { Request, Response } from "express";
import type { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryController {
    constructor(private categoryRepository: CategoryRepository) {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    async getAll(req: Request, res: Response) {
        try {
            const categories = await this.categoryRepository.findAll();
            return res.status(200).json(categories);
        } catch (error) {
            console.error("Erro ao buscar categorias: ", error);
            return res.status(500).json({ message: "Erro ao buscar categorias." });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const category = await this.categoryRepository.findById(id);
            return res.status(200).json(category);
        } catch (error) {
            console.error("Erro ao buscar categoria: ", error);
            return res.status(404).json({ message: "Categoria não encontrada." });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const category = await this.categoryRepository.create(req.body);
            return res.status(201).json(category);
        } catch (error) {
            console.error("Erro ao criar categoria: ", error);
            return res.status(500).json({ message: "Erro ao criar categoria." });
        }
    }

    async update(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const category = await this.categoryRepository.update(id, req.body);
            return res.status(200).json(category);
        } catch (error) {
            console.error("Erro ao atualizar categoria: ", error);
            return res.status(500).json({ message: "Erro ao atualizar categoria." });
        }
    }

    async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const category = await this.categoryRepository.remove(id);
            return res.status(200).json(category);
        } catch (error) {
            console.error("Erro ao deletar categoria: ", error);
            return res.status(500).json({ message: "Erro ao deletar categoria." });
        }
    }
}