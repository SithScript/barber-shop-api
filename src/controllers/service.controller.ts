import type { Request, Response } from "express";
import serviceRepository from "../repositories/service.repository.js";

async function getAll(req: Request, res: Response) {
    try {
        const services = await serviceRepository.findAll();
        res.status(200).json(services);
    } catch (error) {
        console.error("Erro ao buscar serviços: ", error);

        res.status(500).json({
            message: "Erro ao buscar serviços.",
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
        const service = await serviceRepository.findById(id);

        res.status(200).json(service);
    } catch (error) {
        console.error("Erro ao buscar serviço: ", error);

        res.status(404).json({
            message: "Serviço não encontrado.",
        });
    }
}

async function create(req: Request, res: Response) {
    try {
        const service = await serviceRepository.create(req.body);

        res.status(201).json(service);
    } catch (error) {
        console.error("Erro ao criar serviço: ", error);

        res.status(500).json({
            message: "Erro ao criar serviço.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do serviço não informado.",
        });
    }

    try {
        const service = await serviceRepository.update(id, req.body);

        res.status(200).json(service);
    } catch (error) {
        console.error("Erro ao atualizar serviço: ", error);

        res.status(500).json({
            message: "Erro ao atualizar serviço.",
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
        await serviceRepository.remove(id);

        res.status(200).json({
            message: "Serviço removido com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao remover serviço: ", error);

        res.status(500).json({
            message: "Erro ao remover serviço.",
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