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
            .single();

        if (error) throw error;
        return data;
    }

    async create(appointment: Appointment) {
        const { data, error } = await supabase
            .from("appointments")
            .insert([{ ...appointment, status: "scheduled" }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, appointment: Partial<Appointment>) {
        const { data, error } = await supabase
            .from("appointments")
            .update(appointment)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from("appointments")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async remove(id: string) {
        const { data, error } = await supabase
            .from("appointments")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}