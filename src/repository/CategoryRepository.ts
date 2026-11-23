import supabase from "../config/supabase.js";
import { Category } from "../models/Category.js";
import { NotFoundError } from "../errors/NotFoundErrors.js";

async function findAll() {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string): Promise<Category> {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Categoria não encontrada.");
    }

    return Category.restore(
        data.id,
        data.name,
        data.description ?? undefined,
        data.created_at ?? undefined,
    );
}

async function create(category: Category) {
    const { data, error } = await supabase
        .from("categories")
        .insert({
            name: category.getName(),
            description: category.getDescription(),
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function update(category: Category) {
    const id = category.getId();

    if (!id) {
        throw new Error("Categoria sem ID não pode ser atualizada.");
    }

    const { data, error } = await supabase
        .from("categories")
        .update({
            name: category.getName(),
            description: category.getDescription(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Categoria não encontrada.");
    }

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Categoria não encontrada.");
    }

    return data;
}

async function searchByKeyword(keyword: string) {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
        .order("name", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

export class CategoryRepository {
    findAll = findAll;
    findById = findById;
    create = create;
    update = update;
    remove = remove;
    searchByKeyword = searchByKeyword;
}

export default {
    findAll,
    findById,
    create,
    update,
    remove,
    searchByKeyword,
};
