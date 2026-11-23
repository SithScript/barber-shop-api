import supabase from "../config/supabase.js";
import { Appointment } from "../models/Appointment.js";
import { NotFoundError } from "../errors/NotFoundErrors.js";
import { ValidationError } from "../errors/ValidationErrors.js";

async function findAll() {
    const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, price)")
        .order("date_time", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string): Promise<Appointment> {
    const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, price)")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Agendamento não encontrado.");
    }

    return Appointment.restore(
        data.id,
        data.service_id,
        data.client_name,
        data.client_phone,
        data.date_time,
        data.status,
        data.created_at ?? undefined,
    );
}

async function findByDateTime(dateTime: string) {
    const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("date_time", dateTime)
        .neq("status", "cancelado")
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

async function findByService(serviceId: string) {
    const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, price)")
        .eq("service_id", serviceId)
        .order("date_time", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

async function create(appointment: Appointment) {
    const { data, error } = await supabase
        .from("appointments")
        .insert({
            service_id: appointment.getServiceId(),
            client_name: appointment.getClientName(),
            client_phone: appointment.getClientPhone(),
            date_time: appointment.getDateTime(),
            status: appointment.getStatus(),
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23503") {
            throw new ValidationError("O serviço informado não existe.");
        }
        throw error;
    }

    return data;
}

async function update(appointment: Appointment) {
    const id = appointment.getId();

    if (!id) {
        throw new Error("Agendamento sem ID não pode ser atualizado.");
    }

    const { data, error } = await supabase
        .from("appointments")
        .update({
            service_id: appointment.getServiceId(),
            client_name: appointment.getClientName(),
            client_phone: appointment.getClientPhone(),
            date_time: appointment.getDateTime(),
            status: appointment.getStatus(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        if (error.code === "23503") {
            throw new ValidationError("O serviço informado não existe.");
        }
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Agendamento não encontrado.");
    }

    return data;
}

async function updateStatus(id: string, status: string) {
    const { data, error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Agendamento não encontrado.");
    }

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Agendamento não encontrado.");
    }

    return data;
}

export class AppointmentRepository {
    findAll = findAll;
    findById = findById;
    findByDateTime = findByDateTime;
    findByService = findByService;
    create = create;
    update = update;
    updateStatus = updateStatus;
    remove = remove;
}

export default {
    findAll,
    findById,
    findByDateTime,
    findByService,
    create,
    update,
    updateStatus,
    remove,
};
