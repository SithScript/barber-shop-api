import { Request, Response } from "express";
import { servicesRepository, categoriesRepository } from "../repositories/catalog.repository.js";
import { Service } from "../models/catalog.model.js";

export class ProductController {
    // GET /products - Listar todos os serviços/produtos
    public list(req: Request, res: Response): Response {
        return res.status(200).json(servicesRepository);
    }

    // GET /products/:id - Buscar serviço por ID
    public getById(req: Request, res: Response): Response {
        const { id } = req.params;
        const service = servicesRepository.find(s => s.id === id);

        if (!service) {
            return res.status(404).json({ error: "Serviço não encontrado." });
        }

        return res.status(200).json(service);
    }

    // POST /products - Criar novo serviço
    public create(req: Request, res: Response): Response {
        const { categoryId, name, description, price, estimatedMinutes } = req.body;

        if (!categoryId || !name || price === undefined || !estimatedMinutes) {
            return res.status(400).json({
                error: "Os campos categoryId, name, price e estimatedMinutes são obrigatórios."
            });
        }

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

    // PUT /products/:id - Atualizar serviço existente
    public update(req: Request, res: Response): Response {
        const { id } = req.params;
        const { categoryId, name, description, price, estimatedMinutes, available } = req.body;

        const serviceIndex = servicesRepository.findIndex(s => s.id === id);

        if (serviceIndex === -1) {
            return res.status(404).json({ error: "Serviço não encontrado." });
        }

        // Validação se a nova categoria existe (caso tenha sido informada na alteração)
        if (categoryId) {
            const categoryExists = categoriesRepository.some(cat => cat.id === String(categoryId));
            if (!categoryExists) {
                return res.status(404).json({ error: "Categoria informada não existe." });
            }
            servicesRepository[serviceIndex].categoryId = String(categoryId);
        }

        if (name) servicesRepository[serviceIndex].name = name;
        if (description !== undefined) servicesRepository[serviceIndex].description = description;
        if (price !== undefined) servicesRepository[serviceIndex].price = Number(price);
        if (estimatedMinutes !== undefined) servicesRepository[serviceIndex].estimatedMinutes = Number(estimatedMinutes);
        if (available !== undefined) servicesRepository[serviceIndex].available = Boolean(available);

        return res.status(200).json(servicesRepository[serviceIndex]);
    }

    // DELETE /products/:id - Remover serviço
    public delete(req: Request, res: Response): Response {
        const { id } = req.params;

        const serviceIndex = servicesRepository.findIndex(s => s.id === id);

        if (serviceIndex === -1) {
            return res.status(404).json({ error: "Serviço não encontrado." });
        }

        servicesRepository.splice(serviceIndex, 1);
        return res.status(204).send();
    }
}