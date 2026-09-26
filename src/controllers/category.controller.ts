import type { Request, Response } from "express";
import categoryRepository from "../repositories/category.repository.js";

async function getAll(req: Request, res: Response) {
    try {
        const categories = await categoryRepository.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao buscar categorias: ", error);
        res.status(500).json({
            message: "Erro ao buscar categorias.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da categoria não informado.",
        });
    }

    try {
        const category = await categoryRepository.findById(id);
        res.status(200).json(category);
    } catch (error) {
        console.error("Erro ao buscar categoria: ", error);
        res.status(404).json({
            message: "Categoria não encontrada.",
        });
    }
}

async function create(req: Request, res: Response) {
    try {
        const category = await categoryRepository.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        console.error("Erro ao criar categoria: ", error);
        res.status(500).json({
            message: "Erro ao criar categoria.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da categoria não informado.",
        });
    }

    try {
        const category = await categoryRepository.update(id, req.body);
        res.status(200).json(category);
    } catch (error) {
        console.error("Erro ao atualizar categoria: ", error);
        res.status(500).json({
            message: "Erro ao atualizar categoria.",
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da categoria não informado.",
        });
    }

    try {
        await categoryRepository.remove(id);
        res.status(200).json({
            message: "Categoria removida com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao remover categoria: ", error);
        res.status(500).json({
            message: "Erro ao remover categoria.",
        });
    }
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
};