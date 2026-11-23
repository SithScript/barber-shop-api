import { ValidationError } from "../errors/ValidationErrors.js";

const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AppointmentStatus = "agendado" | "finalizado" | "cancelado";

export class Appointment {
    private id: string | undefined;
    private service_id: string;
    private client_name: string;
    private client_phone: string;
    private date_time: string;
    private status: AppointmentStatus;
    private created_at: string | undefined;

    constructor(
        service_id: string,
        client_name: string,
        client_phone: string,
        date_time: string,
        status: AppointmentStatus = "agendado",
    ) {
        this.id = undefined;
        this.service_id = "";
        this.client_name = "";
        this.client_phone = "";
        this.date_time = "";
        this.status = "agendado";
        this.created_at = undefined;

        this.changeService(service_id);
        this.changeClientName(client_name);
        this.changeClientPhone(client_phone);
        this.reschedule(date_time);
        this.changeStatus(status);
    }

    static restore(
        id: string,
        service_id: string,
        client_name: string,
        client_phone: string,
        date_time: string,
        status: AppointmentStatus = "agendado",
        created_at?: string,
    ): Appointment {
        const appointment = new Appointment(
            service_id,
            client_name,
            client_phone,
            date_time,
            status,
        );

        appointment.id = id;
        appointment.created_at = created_at;
        return appointment;
    }

    getId(): string | undefined {
        return this.id;
    }

    getServiceId(): string {
        return this.service_id;
    }

    getClientName(): string {
        return this.client_name;
    }

    getClientPhone(): string {
        return this.client_phone;
    }

    getDateTime(): string {
        return this.date_time;
    }

    getStatus(): AppointmentStatus {
        return this.status;
    }

    getCreatedAt(): string | undefined {
        return this.created_at;
    }

    changeService(service_id: string): void {
        if (typeof service_id !== "string" || service_id.trim().length === 0) {
            throw new ValidationError("O serviço do agendamento é obrigatório.");
        }

        if (!uuidRegex.test(service_id.trim())) {
            throw new ValidationError(
                "O identificador do serviço deve ser um UUID válido.",
            );
        }

        this.service_id = service_id.trim();
    }

    changeClientName(client_name: string): void {
        if (typeof client_name !== "string" || client_name.trim().length === 0) {
            throw new ValidationError("O nome do cliente é obrigatório.");
        }

        this.client_name = client_name.trim();
    }

    changeClientPhone(client_phone: string): void {
        if (typeof client_phone !== "string" || client_phone.trim().length === 0) {
            throw new ValidationError("O telefone do cliente é obrigatório.");
        }

        this.client_phone = client_phone.trim();
    }

    reschedule(date_time: string): void {
        if (typeof date_time !== "string" || date_time.trim().length === 0) {
            throw new ValidationError("A data e hora do agendamento são obrigatórias.");
        }

        const parsedDate = new Date(date_time);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new ValidationError("A data e hora informada é inválida.");
        }

        this.date_time = date_time.trim();
    }

    changeStatus(status: string): void {
        const validStatuses: AppointmentStatus[] = [
            "agendado",
            "finalizado",
            "cancelado",
        ];

        if (!validStatuses.includes(status as AppointmentStatus)) {
            throw new ValidationError(
                "Status inválido. Deve ser 'agendado', 'finalizado' ou 'cancelado'.",
            );
        }

        this.status = status as AppointmentStatus;
    }

    complete(): void {
        this.status = "finalizado";
    }

    cancel(): void {
        this.status = "cancelado";
    }
}
