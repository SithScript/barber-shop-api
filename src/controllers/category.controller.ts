import { Request, Response } from "express";
import { categoriesRepository } from "../repositories/catalog.repository.js";
import { Category } from "../models/catalog.model.js";

export class CategoryController {
    // GET /categories - Listar todas as categorias
    public list(req: Request, res: Response): Response {
        return res.status(200).json(categoriesRepository);
    }

    // GET /categories/:id - Buscar por ID
    public getById(req: Request, res: Response): Response {
        const { id } = req.params;
        const category = categoriesRepository.find(c => c.id === id);

        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada." });
        }

        return res.status(200).json(category);
    }

    // POST /categories - Criar nova categoria
    public create(req: Request, res: Response): Response {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "O nome da categoria é obrigatório." });
        }

        const newCategory: Category = {
            id: String(categoriesRepository.length + 1),
            name,
            description
        };

        categoriesRepository.push(newCategory);
        return res.status(201).json(newCategory);
    }

    // PUT /categories/:id - Atualizar categoria existente
    public update(req: Request, res: Response): Response {
        const { id } = req.params;
        const { name, description } = req.body;

        const categoryIndex = categoriesRepository.findIndex(c => c.id === id);

        if (categoryIndex === -1) {
            return res.status(404).json({ error: "Categoria não encontrada." });
        }

        if (name) categoriesRepository[categoryIndex].name = name;
        if (description !== undefined) categoriesRepository[categoryIndex].description = description;

        return res.status(200).json(categoriesRepository[categoryIndex]);
    }

    // DELETE /categories/:id - Remover categoria
    public delete(req: Request, res: Response): Response {
        const { id } = req.params;

        const categoryIndex = categoriesRepository.findIndex(c => c.id === id);

        if (categoryIndex === -1) {
            return res.status(404).json({ error: "Categoria não encontrada." });
        }

        // Remove do array
        categoriesRepository.splice(categoryIndex, 1);

        return res.status(204).send(); // 204 No Content (sucesso sem corpo de resposta)
    }
}