import { supabase } from "../config/supabase.js"; //repositorio de serviços

async function findAll() {
    const { data, error } = await supabase
        .from("services")
        .select("*");

    if (error) throw error;
    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
}

async function create(service: {
    name: string;
    description?: string;
    price: number;
    estimated_minutes: number;
    category_id: string;
}) {
    const { data, error } = await supabase
        .from("services")
        .insert([service])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function update(
    id: string,
    service: Partial<{
        name: string;
        description: string;
        price: number;
        estimated_minutes: number;
        category_id: string;
    }>
) {
    const { data, error } = await supabase
        .from("services")
        .update(service)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("services")
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
    create,
    update,
    remove
};