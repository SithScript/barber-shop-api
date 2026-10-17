import type { Request, Response } from "express";
import type { CategoryRepository } from "../repositories/category.repository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";

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
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        try {
            if (!id) {
                throw new ValidationError("O ID da categoria é obrigatório.");
            }

            const category = await this.categoryRepository.findById(id);

            if (!category) {
                throw new NotFoundError("Categoria não encontrada.");
            }

            return res.status(200).json(category);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }

    async create(req: Request, res: Response) {
        const { name } = req.body;

        try {
            if (!name || typeof name !== "string" || name.trim() === "") {
                throw new ValidationError("O nome da categoria é obrigatório.");
            }

            const category = await this.categoryRepository.create(req.body);
            return res.status(201).json(category);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }

    async update(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        try {
            if (!id) {
                throw new ValidationError("O ID da categoria é obrigatório.");
            }

            const categoryExists = await this.categoryRepository.findById(id);
            if (!categoryExists) {
                throw new NotFoundError("Categoria não encontrada.");
            }

            const updatedCategory = await this.categoryRepository.update(id, req.body);
            return res.status(200).json(updatedCategory);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }

    async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        try {
            if (!id) {
                throw new ValidationError("O ID da categoria é obrigatório.");
            }

            const categoryExists = await this.categoryRepository.findById(id);
            if (!categoryExists) {
                throw new NotFoundError("Categoria não encontrada.");
            }

            const removedCategory = await this.categoryRepository.remove(id);
            return res.status(200).json(removedCategory);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }
}