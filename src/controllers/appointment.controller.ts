import { Request, Response } from "express";
import { appointmentsRepository } from "../repositories/appointment.repository.js";
import { servicesRepository } from "../repositories/catalog.repository.js";
import { Appointment } from "../models/appointment.model.js";

export class AppointmentController {
    // GET /appointments - Listar todos os agendamentos
    public list(req: Request, res: Response): Response {
        return res.status(200).json(appointmentsRepository);
    }

    // POST /appointments - Criar novo agendamento
    public create(req: Request, res: Response): Response {
        const { clientName, clientPhone, serviceId, dateTime } = req.body;

        // 1. Validação de campos obrigatórios
        if (!clientName || !clientPhone || !serviceId || !dateTime) {
            return res.status(400).json({
                error: "Os campos clientName, clientPhone, serviceId e dateTime são obrigatórios."
            });
        }

        // 2. Regra de Negócio: Verificar se o serviço agendado existe no catálogo
        const serviceExists = servicesRepository.some(s => s.id === String(serviceId));
        if (!serviceExists) {
            return res.status(404).json({ error: "O serviço informado não existe." });
        }

        // 3. Criação do novo agendamento
        const newAppointment: Appointment = {
            id: String(appointmentsRepository.length + 1001),
            clientName,
            clientPhone,
            serviceId: String(serviceId),
            dateTime,
            status: "scheduled"
        };

        appointmentsRepository.push(newAppointment);
        return res.status(201).json(newAppointment);
    }
}