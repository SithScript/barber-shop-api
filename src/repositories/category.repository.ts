import { supabase } from "../config/supabase.js"; //repositorio de categorias
import type { Category } from "../models/category.model.js";

export class CategoryRepository {
    async findAll() {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return data;
    }

    async findById(id: string) {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async create(category: Category) {
        const { data, error } = await supabase
            .from("categories")
            .insert([category])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, category: Partial<Category>) {
        const { data, error } = await supabase
            .from("categories")
            .update(category)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async remove(id: string) {
        const { data, error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}