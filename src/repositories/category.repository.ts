import { supabase } from "../config/supabase.js";  //repositorio de categorias

async function findAll() {
    const { data, error } = await supabase
        .from("categories")
        .select("*");

    if (error) throw error;
    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
}

async function create(category: { name: string; description?: string }) {
    const { data, error } = await supabase
        .from("categories")
        .insert([category])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function update(id: string, category: { name?: string; description?: string }) {
    const { data, error } = await supabase
        .from("categories")
        .update(category)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("categories")
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