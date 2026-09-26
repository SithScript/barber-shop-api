import { supabase } from "../config/supabase.js"; //repositório de agendamentos

async function findAll() {
    const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("date_time", { ascending: true });

    if (error) throw error;
    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
}

async function findActiveByDateTime(dateTime: string) {
    const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("date_time", dateTime)
        .neq("status", "canceled");

    if (error) throw error;
    return data;
}

async function create(appointment: {
    client_name: string;
    client_phone: string;
    service_id: string;
    date_time: string;
}) {
    const { data, error } = await supabase
        .from("appointments")
        .insert([{
            ...appointment,
            status: "scheduled"
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// PUT - Para agendamento
async function update(id: string, appointment: Partial<{
    client_name: string;
    client_phone: string;
    service_id: string;
    date_time: string;
    status: "scheduled" | "completed" | "canceled";
}>) {
    const { data, error } = await supabase
        .from("appointments")
        .update(appointment)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function updateStatus(id: string, status: "scheduled" | "completed" | "canceled") {
    const { data, error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// DELETE - Para agendamento
async function remove(id: string) {
    const { data, error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export default {
    findAll,
    findById,
    findActiveByDateTime,
    create,
    update,
    updateStatus,
    remove
};