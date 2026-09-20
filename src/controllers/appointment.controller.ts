import { Request, Response } from "express";
import { appointmentsRepository } from "../repositories/appointment.repository.js";
import { servicesRepository } from "../repositories/catalog.repository.js";
import { Appointment } from "../models/appointment.model.js";

export class AppointmentController {
    // GET /appointments - Listar todos os agendamentos
    public list(req: Request, res: Response): Response {
        return res.status(200).json(appointmentsRepository);
    }

    // GET /appointments/:id - Buscar agendamento por ID
    public getById(req: Request, res: Response): Response {
        const { id } = req.params;
        const appointment = appointmentsRepository.find(a => a.id === id);

        if (!appointment) {
            return res.status(404).json({ error: "Agendamento não encontrado." });
        }

        return res.status(200).json(appointment);
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

        // 2. Regra de Negócio: Verificar se o serviço existe
        const serviceExists = servicesRepository.some(s => s.id === String(serviceId));
        if (!serviceExists) {
            return res.status(404).json({ error: "O serviço informado não existe." });
        }

        // 3. Regra de Negócio: Verificar se já existe agendamento ativo no mesmo horário
        const hasConflict = appointmentsRepository.some(
            a => a.dateTime === dateTime && a.status !== "canceled"
        );

        if (hasConflict) {
            return res.status(409).json({
                error: "Já existe um agendamento para este dia e horário."
            });
        }

        // 4. Criação do novo agendamento
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

    // PATCH /appointments/:id/status - Atualizar apenas o status do agendamento
    public updateStatus(req: Request, res: Response): Response {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["scheduled", "completed", "canceled"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: "Status inválido. Use apenas: 'scheduled', 'completed' ou 'canceled'."
            });
        }

        const appointment = appointmentsRepository.find(a => a.id === id);

        if (!appointment) {
            return res.status(404).json({ error: "Agendamento não encontrado." });
        }

        appointment.status = status;
        return res.status(200).json(appointment);
    }
}