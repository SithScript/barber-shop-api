import type { Request, Response } from "express";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ServiceRepository } from "../repositories/service.repository.js";

export class AppointmentController {
    constructor(private appointmentRepository: AppointmentRepository,
        private serviceRepository: ServiceRepository) {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.remove = this.remove.bind(this);
    }

    async getAll(req: Request, res: Response) {
        try {
            const appointments = await this.appointmentRepository.findAll();
            return res.status(200).json(appointments);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        try {
            if (!id) {
                throw new ValidationError("O ID do agendamento é obrigatório.");
            }

            const appointment = await this.appointmentRepository.findById(id);

            if (!appointment) {
                throw new NotFoundError("Agendamento não encontrado.");
            }

            return res.status(200).json(appointment);
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
        const { service_id, client_name, client_phone, date_time } = req.body;

        try {
            if (!service_id) {
                throw new ValidationError("O ID do serviço é obrigatório.");
            }
            if (!client_name || client_name.trim() === "") {
                throw new ValidationError("O nome do cliente é obrigatório.");
            }
            if (!client_phone || client_phone.trim() === "") {
                throw new ValidationError("O telefone do cliente é obrigatório.");
            }
            if (!date_time) {
                throw new ValidationError("A data e hora do agendamento são obrigatórias.");
            }

            const service = await this.serviceRepository.findById(service_id);

            if (!service) {
                throw new NotFoundError("Serviço informado não foi encontrado.")
            }

            if (service.is_active === false) {
                throw new ValidationError("Não é possível agendar um serviço inativo")
            }

            const existingAppointment = await this.appointmentRepository.findByDateTime(date_time);
            if (existingAppointment) {
                throw new ValidationError("Este horário já está preenchido por outro agendamento.");
            }

            const appointment = await this.appointmentRepository.create(req.body);
            return res.status(201).json(appointment);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }

    async updateStatus(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            if (!id) {
                throw new ValidationError("O ID do agendamento é obrigatório.");
            }

            // "scheduled" = Agendado, ainda vai acontecer.
            // "completed" = Concluído, já foi finalizado.
            // "canceled" = Cancelado, não será realizado.
            const validStatuses = [ "agendado", "finalizado", "cancelado" ];
            if (!status || !validStatuses.includes(status)) {
                throw new ValidationError("Status inválido. Deve ser 'agendado', 'finalizado' ou 'cancelado'.");
            }

            const appointmentExists = await this.appointmentRepository.findById(id);
            if (!appointmentExists) {
                throw new NotFoundError("Agendamento não encontrado para atualização de status.");
            }

            const appointment = await this.appointmentRepository.updateStatus(id, status);
            return res.status(200).json(appointment);
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

    async update(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        try {
            if (!id) {
                throw new ValidationError("O ID do agendamento é obrigatório.");
            }

            const appointmentExists = await this.appointmentRepository.findById(id);
            if (!appointmentExists) {
                throw new NotFoundError("Agendamento não encontrado para atualização.");
            }

            const updatedAppointment = await this.appointmentRepository.update(id, req.body);
            return res.status(200).json(updatedAppointment);
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
                throw new ValidationError("O ID do agendamento é obrigatório.");
            }

            const appointmentExists = await this.appointmentRepository.findById(id);
            if (!appointmentExists) {
                throw new NotFoundError("Agendamento não encontrado para remoção.");
            }

            const removedAppointment = await this.appointmentRepository.remove(id);
            return res.status(200).json(removedAppointment);
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
}