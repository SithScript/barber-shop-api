import type { Request, Response } from "express";
import type { ServiceRepository } from "../repositories/service.repository.js";

export class ServiceController {
    constructor(private serviceRepository: ServiceRepository) {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    async getAll(req: Request, res: Response) {
        try {
            const services = await this.serviceRepository.findAll();
            return res.status(200).json(services);
        } catch (error) {
            console.error("Erro ao buscar serviços: ", error);
            return res.status(500).json({ message: "Erro ao buscar serviços." });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const service = await this.serviceRepository.findById(id);
            return res.status(200).json(service);
        } catch (error) {
            console.error("Erro ao buscar serviço: ", error);
            return res.status(404).json({ message: "Serviço não encontrado." });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const service = await this.serviceRepository.create(req.body);
            return res.status(201).json(service);
        } catch (error) {
            console.error("Erro ao criar serviço: ", error);
            return res.status(500).json({ message: "Erro ao criar serviço." });
        }
    }

    async update(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const service = await this.serviceRepository.update(id, req.body);
            return res.status(200).json(service);
        } catch (error) {
            console.error("Erro ao atualizar serviço: ", error);
            return res.status(500).json({ message: "Erro ao atualizar serviço." });
        }
    }

    async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const service = await this.serviceRepository.remove(id);
            return res.status(200).json(service);
        } catch (error) {
            console.error("Erro ao deletar serviço: ", error);
            return res.status(500).json({ message: "Erro ao deletar serviço." });
        }
    }
}