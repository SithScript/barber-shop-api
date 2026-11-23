import { randomUUID } from "node:crypto";
import { afterEach, beforeAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import supabase from "../config/supabase.js";

describe("Category - Teste de Integração", () => {
    let supabaseOnline = false;
    const testNames: string[] = [];

    beforeAll(async () => {
        try {
            const { error } = await supabase
                .from("categories")
                .select("id")
                .limit(1);
            if (!error) {
                supabaseOnline = true;
            }
        } catch {
            supabaseOnline = false;
        }

        if (!supabaseOnline) {
            console.warn(
                "⚠️  Supabase não está acessível no momento. Os testes de integração foram ignorados.",
            );
        }
    });

    function makeCategoryData() {
        const name = `Teste integração ${randomUUID()}`;
        testNames.push(name);

        return {
            name,
            description: "Categoria criada pelo teste de integração",
        };
    }

    async function createCategory() {
        const data = makeCategoryData();
        const response = await request(app).post("/categories").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));

        return {
            id: response.body.id as string,
            data,
        };
    }

    afterEach(async () => {
        if (!supabaseOnline) return;

        const names = testNames.slice(0);
        if (names.length === 0) {
            return;
        }

        try {
            await supabase.from("categories").delete().in("name", names);
        } catch (error: any) {
            console.warn(`Falha ao limpar categorias do teste: ${error.message}`);
        }
    });

    it("deve criar uma categoria válida", async (ctx) => {
        if (!supabaseOnline) {
            ctx.skip();
            return;
        }

        const data = makeCategoryData();
        const response = await request(app).post("/categories").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body).toMatchObject(data);
    });

    it("deve listar as categorias incluindo a categoria criada", async (ctx) => {
        if (!supabaseOnline) {
            ctx.skip();
            return;
        }

        const { id, data } = await createCategory();
        const response = await request(app).get("/categories");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    name: data.name,
                }),
            ]),
        );
    }, 20_000);

    it("deve consultar uma categoria por ID", async (ctx) => {
        if (!supabaseOnline) {
            ctx.skip();
            return;
        }

        const { id, data } = await createCategory();
        const response = await request(app).get(`/categories/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            name: data.name,
            description: data.description,
        });
    }, 20_000);

    it("deve buscar uma categoria por palavra-chave", async (ctx) => {
        if (!supabaseOnline) {
            ctx.skip();
            return;
        }

        const { id, data } = await createCategory();
        const response = await request(app).get(
            `/categories/search/${encodeURIComponent(data.name)}`,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    name: data.name,
                }),
            ]),
        );
    }, 20_000);

    it("deve atualizar os dados de uma categoria existente", async (ctx) => {
        if (!supabaseOnline) {
            ctx.skip();
            return;
        }

        const { id } = await createCategory();

        const updateData = {
            name: `Atualizado ${randomUUID()}`,
            description: "Descrição atualizada pelo teste.",
        };
        testNames.push(updateData.name);

        const response = await request(app)
            .put(`/categories/${id}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...updateData,
        });
    }, 20_000);

    it("deve remover uma categoria existente", async (ctx) => {
        if (!supabaseOnline) {
            ctx.skip();
            return;
        }

        const { id } = await createCategory();
        const response = await request(app).delete(`/categories/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Categoria removida com sucesso!",
        });
    }, 20_000);
});
