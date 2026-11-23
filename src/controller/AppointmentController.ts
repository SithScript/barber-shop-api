import type { Request, Response } from "express";
import { Appointment } from "../models/Appointment.js";
import AppointmentRepository from "../repository/AppointmentRepository.js";
import ServiceRepository from "../repository/ServiceRepository.js";
import { ValidationError } from "../errors/ValidationErrors.js";
import { NotFoundError } from "../errors/NotFoundErrors.js";

async function getAll(req: Request, res: Response) {
    try {
        const appointments = await AppointmentRepository.findAll();
        return res.status(200).json(appointments);
    } catch (error: any) {
        console.error("Erro ao buscar agendamentos:", error);
        return res.status(500).json({
            message: "Erro ao buscar agendamentos.",
            error: error.message,
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
        const appointment = await AppointmentRepository.findById(id);

        return res.status(200).json({
            id: appointment.getId(),
            service_id: appointment.getServiceId(),
            client_name: appointment.getClientName(),
            client_phone: appointment.getClientPhone(),
            date_time: appointment.getDateTime(),
            status: appointment.getStatus(),
            created_at: appointment.getCreatedAt(),
        });
    } catch (error: any) {
        console.error("Erro ao buscar agendamento:", error);

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
            message: "Erro interno ao buscar agendamento.",
            error: error.message,
        });
    }
}

async function getByService(
    req: Request<{ serviceId: string }>,
    res: Response,
) {
    const { serviceId } = req.params;

    if (!serviceId) {
        return res.status(400).json({
            message: "ID do serviço não informado.",
        });
    }

    try {
        const appointments = await AppointmentRepository.findByService(serviceId);
        return res.status(200).json(appointments);
    } catch (error: any) {
        console.error("Erro ao buscar agendamentos por serviço:", error);
        return res.status(500).json({
            message: "Erro ao buscar agendamentos por serviço.",
            error: error.message,
        });
    }
}

async function create(req: Request, res: Response) {
    const { service_id, client_name, client_phone, date_time, status } =
        req.body;

    try {
        const appointment = new Appointment(
            service_id,
            client_name,
            client_phone,
            date_time,
            status || "agendado",
        );

        // Valida se o serviço existe
        const service = await ServiceRepository.findById(
            appointment.getServiceId(),
        );

        // Valida se o serviço está ativo
        if (!service.isActive()) {
            throw new ValidationError(
                "Não é possível agendar um serviço inativo.",
            );
        }

        // Valida conflito de horário
        const existingAppointment = await AppointmentRepository.findByDateTime(
            appointment.getDateTime(),
        );
        if (existingAppointment) {
            throw new ValidationError(
                "Este horário já está preenchido por outro agendamento.",
            );
        }

        const createdAppointment =
            await AppointmentRepository.create(appointment);
        return res.status(201).json(createdAppointment);
    } catch (error: any) {
        console.error("Erro ao criar agendamento:", error);

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
            message: "Erro interno ao criar agendamento.",
            error: error.message,
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { service_id, client_name, client_phone, date_time, status } =
        req.body;

    if (!id) {
        return res.status(400).json({
            message: "ID do agendamento não informado.",
        });
    }

    try {
        const appointment = await AppointmentRepository.findById(id);

        if (service_id !== undefined) {
            const service = await ServiceRepository.findById(service_id);
            if (!service.isActive()) {
                throw new ValidationError(
                    "Não é possível agendar um serviço inativo.",
                );
            }
            appointment.changeService(service_id);
        }

        if (client_name !== undefined) {
            appointment.changeClientName(client_name);
        }

        if (client_phone !== undefined) {
            appointment.changeClientPhone(client_phone);
        }

        if (date_time !== undefined) {
            if (date_time !== appointment.getDateTime()) {
                const existing =
                    await AppointmentRepository.findByDateTime(date_time);
                if (existing && existing.id !== id) {
                    throw new ValidationError(
                        "Este horário já está preenchido por outro agendamento.",
                    );
                }
            }
            appointment.reschedule(date_time);
        }

        if (status !== undefined) {
            appointment.changeStatus(status);
        }

        const updatedAppointment =
            await AppointmentRepository.update(appointment);
        return res.status(200).json(updatedAppointment);
    } catch (error: any) {
        console.error("Erro ao atualizar agendamento:", error);

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
            message: "Erro interno ao atualizar agendamento.",
            error: error.message,
        });
    }
}

async function updateStatus(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "ID do agendamento não informado.",
        });
    }

    try {
        const appointment = await AppointmentRepository.findById(id);
        appointment.changeStatus(status);

        const updated = await AppointmentRepository.updateStatus(
            id,
            appointment.getStatus(),
        );
        return res.status(200).json(updated);
    } catch (error: any) {
        console.error("Erro ao atualizar status do agendamento:", error);

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
            message: "Erro interno ao atualizar status do agendamento.",
            error: error.message,
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
        await AppointmentRepository.remove(id);
        return res.status(200).json({
            message: "Agendamento removido com sucesso.",
        });
    } catch (error: any) {
        console.error("Erro ao remover agendamento:", error);

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
            message: "Erro interno ao remover agendamento.",
            error: error.message,
        });
    }
}

export default {
    getAll,
    getById,
    getByService,
    create,
    update,
    updateStatus,
    remove,
};
