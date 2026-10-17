import type { Request, Response } from "express";
import type { ServiceRepository } from "../repositories/service.repository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";

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
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        try {
            if (!id) {
                throw new ValidationError("O ID do serviço é obrigatório.");
            }

            const service = await this.serviceRepository.findById(id);

            if (!service) {
                throw new NotFoundError("Serviço não encontrado.");
            }

            return res.status(200).json(service);
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
        const { name, category_id, price, estimated_minutes } = req.body;

        try {
            if (!name || typeof name !== "string" || name.trim() === "") {
                throw new ValidationError("O nome do serviço é obrigatório.");
            }
            if (!category_id) {
                throw new ValidationError("A categoria do serviço é obrigatória.");
            }
            if (price === undefined || price === null || price < 0) {
                throw new ValidationError("O preço do serviço deve ser um valor válido.");
            }
            if (!estimated_minutes || estimated_minutes <= 0) {
                throw new ValidationError("A duração estimada deve ser informada em minutos.");
            }

            const service = await this.serviceRepository.create(req.body);
            return res.status(201).json(service);
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
                throw new ValidationError("O ID do serviço é obrigatório.");
            }

            const serviceExists = await this.serviceRepository.findById(id);
            if (!serviceExists) {
                throw new NotFoundError("Serviço não encontrado para atualização.");
            }

            const updatedService = await this.serviceRepository.update(id, req.body);
            return res.status(200).json(updatedService);
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
                throw new ValidationError("O ID do serviço é obrigatório.");
            }

            const serviceExists = await this.serviceRepository.findById(id);
            if (!serviceExists) {
                throw new NotFoundError("Serviço não encontrado para remoção.");
            }

            const removedService = await this.serviceRepository.remove(id);
            return res.status(200).json(removedService);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message });
            }
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            // Tratamento para violação de chave estrangeira do Postgres (Código 23503)
            if (error.code === "23503") {
                return res.status(400).json({
                    error: "Não é possível apagar este serviço pois existem agendamentos associados a ele."
                });
            }
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }
}