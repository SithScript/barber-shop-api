import type { Request, Response } from "express";
import CategoryRepository from "../repository/CategoryRepository.js";
import { Category } from "../models/Category.js";
import { ValidationError } from "../errors/ValidationErrors.js";
import { NotFoundError } from "../errors/NotFoundErrors.js";

async function getAll(req: Request, res: Response) {
    try {
        const categories = await CategoryRepository.findAll();
        return res.status(200).json(categories);
    } catch (error: any) {
        console.error("Erro ao buscar categorias: ", error);
        return res.status(500).json({
            message: "Erro ao buscar categorias.",
            error: error.message,
        });
    }
}

async function getByKeyword(req: Request<{ keyword: string }>, res: Response) {
    const keyword = (req.params.keyword || req.query.keyword) as string;

    if (!keyword || typeof keyword !== "string") {
        return res.status(400).json({
            message: "Palavra-chave não informada.",
        });
    }

    try {
        const categories = await CategoryRepository.searchByKeyword(keyword);
        return res.status(200).json(categories);
    } catch (error: any) {
        console.error("Erro ao pesquisar por categoria: ", error);
        return res.status(500).json({
            message: "Erro ao pesquisar categoria.",
            error: error.message,
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da Categoria não informado.",
        });
    }

    try {
        const category = await CategoryRepository.findById(id);

        return res.status(200).json({
            id: category.getId(),
            name: category.getName(),
            description: category.getDescription(),
            created_at: category.getCreatedAt(),
        });
    } catch (error: any) {
        console.error("Erro ao buscar categoria: ", error);

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
            message: "Erro interno ao buscar categoria.",
            error: error.message,
        });
    }
}

async function create(req: Request, res: Response) {
    const { name, description } = req.body;

    try {
        const category = new Category(name, description);
        const createdCategory = await CategoryRepository.create(category);

        return res.status(201).json(createdCategory);
    } catch (error: any) {
        console.error("Erro ao criar categoria: ", error);

        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Erro ao criar categoria.",
            error: error.message,
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "ID da Categoria não informado.",
        });
    }

    try {
        const category = await CategoryRepository.findById(id);

        if (name !== undefined) {
            category.rename(name);
        }

        if (description !== undefined) {
            category.changeDescription(description);
        }

        const updatedCategory = await CategoryRepository.update(category);

        return res.status(200).json(updatedCategory);
    } catch (error: any) {
        console.error("Erro ao atualizar categoria: ", error);

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
            message: "Erro interno ao atualizar categoria.",
            error: error.message,
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da Categoria não informado.",
        });
    }

    try {
        await CategoryRepository.remove(id);

        return res.status(200).json({
            message: "Categoria removida com sucesso!",
        });
    } catch (error: any) {
        console.error("Erro ao remover categoria: ", error);

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
            message: "Erro interno ao remover categoria.",
            error: error.message,
        });
    }
}

export default {
    getAll,
    getById,
    getByKeyword,
    create,
    update,
    remove,
};
