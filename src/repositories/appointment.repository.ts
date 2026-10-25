import { supabase } from "../config/supabase.js"; //repositório de agendamentos
import type { Appointment } from "../models/appointment.model.js";

export class AppointmentRepository {
    async findAll() {
        const { data, error } = await supabase
            .from("appointments")
            .select("*, services(name, price)")
            .order("date_time", { ascending: true });

        if (error) throw error;
        return data;
    }

    async findById(id: string) {
        const { data, error } = await supabase
            .from("appointments")
            .select("*, services(name, price)")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async create(appointment: Appointment) {
        const { data, error } = await supabase
            .from("appointments")
            .insert([{ ...appointment, status: "agendado" }])
            .select()
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async update(id: string, appointment: Partial<Appointment>) {
        const { data, error } = await supabase
            .from("appointments")
            .update(appointment)
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async updateStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from("appointments")
            .update({ status })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async remove(id: string) {
        const { data, error } = await supabase
            .from("appointments")
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data;
    }
    
    async findByDateTime(dateTime: string) {
        const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("date_time", dateTime)
        .neq("status", "cancelado")
        .maybeSingle();
        
        if (error) throw error;
        return data;
    }
}