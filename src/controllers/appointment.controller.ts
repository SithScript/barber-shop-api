import type { Request, Response } from "express";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";

export class AppointmentController {
    constructor(private appointmentRepository: AppointmentRepository) {
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
        } catch (error) {
            console.error("Erro ao buscar agendamentos: ", error);
            return res.status(500).json({ message: "Erro ao buscar agendamentos." });
        }
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const appointment = await this.appointmentRepository.findById(id);
            return res.status(200).json(appointment);
        } catch (error) {
            console.error("Erro ao buscar agendamento: ", error);
            return res.status(404).json({ message: "Agendamento não encontrado." });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const appointment = await this.appointmentRepository.create(req.body);
            return res.status(201).json(appointment);
        } catch (error) {
            console.error("Erro ao criar agendamento: ", error);
            return res.status(500).json({ message: "Erro ao criar agendamento." });
        }
    }

    async updateStatus(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const { status } = req.body;
            const appointment = await this.appointmentRepository.updateStatus(id, status);
            return res.status(200).json(appointment);
        } catch (error) {
            console.error("Erro ao atualizar status: ", error);
            return res.status(500).json({ message: "Erro ao atualizar status do agendamento." });
        }
    }

    async update(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const appointment = await this.appointmentRepository.update(id, req.body);
            return res.status(200).json(appointment);
        } catch (error) {
            console.error("Erro ao atualizar agendamento: ", error);
            return res.status(500).json({ message: "Erro ao atualizar agendamento." });
        }
    }

    async remove(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID não informado." });

        try {
            const appointment = await this.appointmentRepository.remove(id);
            return res.status(200).json(appointment);
        } catch (error) {
            console.error("Erro ao deletar agendamento: ", error);
            return res.status(500).json({ message: "Erro ao deletar agendamento." });
        }
    }
}