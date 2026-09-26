import type { Request, Response } from "express";
import appointmentRepository from "../repositories/appointment.repository.js";

async function getAll(req: Request, res: Response) {
    try {
        const appointments = await appointmentRepository.findAll();
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Erro ao buscar agendamentos: ", error);

        res.status(500).json({
            message: "Erro ao buscar agendamentos.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do agendamento não informado.",
        });
    }

    try {
        const appointment = await appointmentRepository.findById(id);

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Erro ao buscar agendamento: ", error);

        res.status(404).json({
            message: "Agendamento não encontrado.",
        });
    }
}

async function create(req: Request, res: Response) {
    try {
        const appointment = await appointmentRepository.create(req.body);

        res.status(201).json(appointment);
    } catch (error) {
        console.error("Erro ao criar agendamento: ", error);

        res.status(500).json({
            message: "Erro ao criar agendamento.",
        });
    }
}

async function updateStatus(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do agendamento não informado.",
        });
    }

    try {
        const { status } = req.body;
        const appointment = await appointmentRepository.updateStatus(id, status);

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Erro ao atualizar status do agendamento: ", error);

        res.status(500).json({
            message: "Erro ao atualizar status do agendamento.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do agendamento não informado.",
        });
    }

    try {
        const appointment = await appointmentRepository.update(id, req.body);

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Erro ao atualizar agendamento: ", error);

        res.status(500).json({
            message: "Erro ao atualizar agendamento.",
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do agendamento não informado.",
        });
    }

    try {
        const appointment = await appointmentRepository.remove(id);

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Erro ao deletar agendamento: ", error);

        res.status(500).json({
            message: "Erro ao deletar agendamento.",
        });
    }
}

export default {
    getAll,
    getById,
    create,
    updateStatus,
    update,
    remove
};