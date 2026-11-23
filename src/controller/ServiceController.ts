import type { Request, Response } from "express";
import { Service } from "../models/Service.js";
import ServiceRepository from "../repository/ServiceRepository.js";
import CategoryRepository from "../repository/CategoryRepository.js";
import { ValidationError } from "../errors/ValidationErrors.js";
import { NotFoundError } from "../errors/NotFoundErrors.js";

async function getAll(req: Request, res: Response) {
    try {
        const services = await ServiceRepository.findAll();
        return res.status(200).json(services);
    } catch (error: any) {
        console.error("Erro ao buscar serviços:", error);
        return res.status(500).json({
            message: "Erro ao buscar serviços.",
            error: error.message,
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do serviço não informado.",
        });
    }

    try {
        const service = await ServiceRepository.findById(id);

        return res.status(200).json({
            id: service.getId(),
            category_id: service.getCategoryId(),
            name: service.getName(),
            description: service.getDescription(),
            price: service.getPrice(),
            estimated_minutes: service.getEstimatedMinutes(),
            is_active: service.isActive(),
            created_at: service.getCreatedAt(),
        });
    } catch (error: any) {
        console.error("Erro ao buscar serviço:", error);

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
                error: error.message,
            });
        }
        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro interno ao buscar serviço.",
            error: error.message,
        });
    }
}

async function getByCategory(
    req: Request<{ categoryId: string }>,
    res: Response,
) {
    const { categoryId } = req.params;

    if (!categoryId) {
        return res.status(400).json({
            message: "ID da categoria não informado.",
        });
    }

    try {
        const services = await ServiceRepository.findByCategory(categoryId);
        return res.status(200).json(services);
    } catch (error: any) {
        console.error("Erro ao buscar serviços da categoria:", error);
        return res.status(500).json({
            message: "Erro ao buscar serviços da categoria.",
            error: error.message,
        });
    }
}

async function search(req: Request, res: Response) {
    const keyword = (req.params.keyword || req.query.keyword) as string;

    if (!keyword || typeof keyword !== "string") {
        return res.status(400).json({
            message: "Palavra-chave não informada.",
        });
    }

    try {
        const services = await ServiceRepository.searchByKeyword(keyword);
        return res.status(200).json(services);
    } catch (error: any) {
        console.error("Erro ao pesquisar serviços:", error);
        return res.status(500).json({
            message: "Erro ao pesquisar serviços.",
            error: error.message,
        });
    }
}

async function create(req: Request, res: Response) {
    const {
        category_id,
        name,
        price,
        estimated_minutes,
        description,
        is_active,
    } = req.body;

    try {
        const service = new Service(
            category_id,
            name,
            price,
            estimated_minutes,
            description,
            is_active !== undefined ? is_active : true,
        );

        // Verifica se a categoria associada realmente existe
        await CategoryRepository.findById(service.getCategoryId());

        const createdService = await ServiceRepository.create(service);
        return res.status(201).json(createdService);
    } catch (error: any) {
        console.error("Erro ao criar serviço:", error);

        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
                error: error.message,
            });
        }
        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro interno ao criar serviço.",
            error: error.message,
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const {
        category_id,
        name,
        price,
        estimated_minutes,
        description,
        is_active,
    } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "ID do serviço não informado.",
        });
    }

    try {
        const service = await ServiceRepository.findById(id);

        if (category_id !== undefined) {
            await CategoryRepository.findById(category_id);
            service.changeCategory(category_id);
        }

        if (name !== undefined) {
            service.rename(name);
        }

        if (price !== undefined) {
            service.changePrice(price);
        }

        if (estimated_minutes !== undefined) {
            service.changeEstimatedMinutes(estimated_minutes);
        }

        if (description !== undefined) {
            service.changeDescription(description);
        }

        if (is_active === true) {
            service.activate();
        }

        if (is_active === false) {
            service.deactivate();
        }

        const updatedService = await ServiceRepository.update(service);
        return res.status(200).json(updatedService);
    } catch (error: any) {
        console.error("Erro ao atualizar serviço:", error);

        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
                error: error.message,
            });
        }

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro interno ao atualizar serviço.",
            error: error.message,
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do serviço não informado.",
        });
    }

    try {
        await ServiceRepository.remove(id);
        return res.status(200).json({
            message: "Serviço removido com sucesso.",
        });
    } catch (error: any) {
        console.error("Erro ao remover serviço:", error);

        if (error instanceof NotFoundError) {
            return res.status(404).json({
                message: error.message,
                error: error.message,
            });
        }
        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro interno ao remover serviço.",
            error: error.message,
        });
    }
}

export default {
    getAll,
    getById,
    getByCategory,
    search,
    create,
    update,
    remove,
};
