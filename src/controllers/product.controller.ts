import { Request, Response } from "express";
import { servicesRepository, categoriesRepository } from "../repositories/catalog.repository.js";
import { Service } from "../models/catalog.model.js";

export class ProductController {
    // GET /products - Listar todos os serviços/produtos
    public list(req: Request, res: Response): Response {
        return res.status(200).json(servicesRepository);
    }

    // POST /products - Criar um novo serviço/produto
    public create(req: Request, res: Response): Response {
        const { categoryId, name, description, price, estimatedMinutes } = req.body;

        // Validação de campos obrigatórios
        if (!categoryId || !name || price === undefined || !estimatedMinutes) {
            return res.status(400).json({
                error: "Os campos categoryId, name, price e estimatedMinutes são obrigatórios."
            });
        }

        // Regra de negócio: Verificar se a categoria informada existe
        const categoryExists = categoriesRepository.some(cat => cat.id === String(categoryId));
        if (!categoryExists) {
            return res.status(404).json({ error: "Categoria informada não existe." });
        }

        const newService: Service = {
            id: String(servicesRepository.length + 101),
            categoryId: String(categoryId),
            name,
            description: description || "",
            price: Number(price),
            estimatedMinutes: Number(estimatedMinutes),
            available: true
        };

        servicesRepository.push(newService);

        return res.status(201).json(newService);
    }
}