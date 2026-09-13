import { Request, Response } from "express";
import { categoriesRepository } from "../repositories/catalog.repository.js";
import { Category } from "../models/catalog.model.js";

export class CategoryController {
    // GET /categories - Listar todas as categorias
    public list(req: Request, res: Response): Response {
        return res.status(200).json(categoriesRepository);
    }

    // POST /categories - Criar uma nova categoria
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
}