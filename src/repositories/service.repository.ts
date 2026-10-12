import { supabase } from "../config/supabase.js"; //repositorio de serviços
import type { Service } from "../models/service.model.js";

export class ServiceRepository {
    async findAll() {
        const { data, error } = await supabase
            .from("services")
            .select("*, categories(name)")
            .order("name", { ascending: true });

        if (error) throw error;
        return data;
    }

    async findById(id: string) {
        const { data, error } = await supabase
            .from("services")
            .select("*, categories(name)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async create(service: Service) {
        const { data, error } = await supabase
            .from("services")
            .insert([service])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, service: Partial<Service>) {
        const { data, error } = await supabase
            .from("services")
            .update(service)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async remove(id: string) {
        const { data, error } = await supabase
            .from("services")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}