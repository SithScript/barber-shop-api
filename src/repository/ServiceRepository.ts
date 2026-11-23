import supabase from "../config/supabase.js";
import { Service } from "../models/Service.js";
import { NotFoundError } from "../errors/NotFoundErrors.js";
import { ValidationError } from "../errors/ValidationErrors.js";

async function findAll() {
    const { data, error } = await supabase
        .from("services")
        .select("*, categories(name)")
        .order("name", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string): Promise<Service> {
    const { data, error } = await supabase
        .from("services")
        .select("*, categories(name)")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Serviço não encontrado.");
    }

    return Service.restore(
        data.id,
        data.category_id,
        data.name,
        Number(data.price),
        data.estimated_minutes,
        data.is_active ?? true,
        data.description ?? undefined,
        data.created_at ?? undefined,
    );
}

async function findByCategory(categoryId: string) {
    const { data, error } = await supabase
        .from("services")
        .select("*, categories(name)")
        .eq("category_id", categoryId);

    if (error) {
        throw error;
    }

    return data;
}

async function searchByKeyword(keyword: string) {
    const { data, error } = await supabase
        .from("services")
        .select("*, categories(name)")
        .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`);

    if (error) {
        throw error;
    }

    return data;
}

async function create(service: Service) {
    const { data, error } = await supabase
        .from("services")
        .insert({
            category_id: service.getCategoryId(),
            name: service.getName(),
            price: service.getPrice(),
            estimated_minutes: service.getEstimatedMinutes(),
            is_active: service.isActive(),
            description: service.getDescription(),
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23503") {
            throw new ValidationError("A categoria informada não existe.");
        }
        throw error;
    }

    return data;
}

async function update(service: Service) {
    const id = service.getId();

    if (!id) {
        throw new Error("Serviço sem ID não pode ser atualizado.");
    }

    const { data, error } = await supabase
        .from("services")
        .update({
            category_id: service.getCategoryId(),
            name: service.getName(),
            price: service.getPrice(),
            estimated_minutes: service.getEstimatedMinutes(),
            is_active: service.isActive(),
            description: service.getDescription(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        if (error.code === "23503") {
            throw new ValidationError("A categoria informada não existe.");
        }
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Serviço não encontrado.");
    }

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("services")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        if (error.code === "23503") {
            throw new ValidationError(
                "Não é possível apagar este serviço pois existem agendamentos associados a ele.",
            );
        }
        throw error;
    }

    if (!data) {
        throw new NotFoundError("Serviço não encontrado.");
    }

    return data;
}

export class ServiceRepository {
    findAll = findAll;
    findById = findById;
    findByCategory = findByCategory;
    searchByKeyword = searchByKeyword;
    create = create;
    update = update;
    remove = remove;
}

export default {
    findAll,
    findById,
    findByCategory,
    searchByKeyword,
    create,
    update,
    remove,
};
