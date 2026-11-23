import { describe, it, expect } from "vitest";
import { Category } from "../models/Category.js";

describe("Category - Testes Unitários", () => {
    it("deve criar uma categoria válida", () => {
        const name = "Cabelo";
        const description = "Cortes e tratamentos capilares";

        const category = new Category(name, description);

        expect(category.getName()).toBe("Cabelo");
        expect(category.getDescription()).toBe(
            "Cortes e tratamentos capilares",
        );
        expect(category.getId()).toBeUndefined();
    });

    it("não deve permitir criar uma categoria com nome vazio", () => {
        expect(() => {
            new Category("");
        }).toThrow("O nome da categoria é obrigatório.");
    });

    it("não deve permitir criar uma categoria com nome contendo apenas espaços", () => {
        expect(() => {
            new Category("      ");
        }).toThrow("O nome da categoria é obrigatório.");
    });

    it("deve remover espaços antes e depois do nome da categoria (trim)", () => {
        const category = new Category("   Barba   ");
        expect(category.getName()).toBe("Barba");
    });

    it("deve permitir renomear uma categoria existente", () => {
        const category = new Category("Cabelo");
        category.rename("Cabelo e Barba");

        expect(category.getName()).toBe("Cabelo e Barba");
    });

    it("deve preservar o nome original após uma tentativa inválida de renomeação", () => {
        const category = new Category("Cabelo");

        expect(() => {
            category.rename("");
        }).toThrow("O nome da categoria é obrigatório.");

        expect(category.getName()).toBe("Cabelo");
    });

    it("deve permitir alterar a descrição de uma categoria", () => {
        const category = new Category("Cabelo", "Descrição inicial");
        category.changeDescription("Nova descrição atualizada");

        expect(category.getDescription()).toBe("Nova descrição atualizada");
    });

    it("deve restaurar uma categoria existente com ID e data de criação", () => {
        const id = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
        const name = "Cabelo";
        const description = "Serviços de corte";
        const createdAt = "2026-10-12T14:44:19.000Z";

        const category = Category.restore(id, name, description, createdAt);

        expect(category.getId()).toBe(id);
        expect(category.getName()).toBe("Cabelo");
        expect(category.getDescription()).toBe("Serviços de corte");
        expect(category.getCreatedAt()).toBe(createdAt);
    });
});
