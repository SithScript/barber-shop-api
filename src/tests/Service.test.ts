import { describe, it, expect } from "vitest";
import { Service } from "../models/Service.js";

describe("Service - Testes Unitários", () => {
    const validCategoryId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    it("deve criar um serviço válido", () => {
        const service = new Service(
            validCategoryId,
            "Corte Degradê",
            45.0,
            40,
            "Corte moderno com navalha",
        );

        expect(service.getCategoryId()).toBe(validCategoryId);
        expect(service.getName()).toBe("Corte Degradê");
        expect(service.getPrice()).toBe(45.0);
        expect(service.getEstimatedMinutes()).toBe(40);
        expect(service.getDescription()).toBe("Corte moderno com navalha");
        expect(service.isActive()).toBe(true);
        expect(service.getId()).toBeUndefined();
    });

    it("não deve permitir criar serviço com identificador de categoria inválido", () => {
        expect(() => {
            new Service("id-invalido", "Corte", 30, 30);
        }).toThrow("O identificador da categoria deve ser um UUID válido.");
    });

    it("não deve permitir criar serviço com nome vazio", () => {
        expect(() => {
            new Service(validCategoryId, "   ", 30, 30);
        }).toThrow("O nome do serviço é obrigatório.");
    });

    it("não deve permitir criar serviço com preço negativo", () => {
        expect(() => {
            new Service(validCategoryId, "Corte", -10, 30);
        }).toThrow(
            "O preço do serviço deve ser um número maior ou igual a zero.",
        );
    });

    it("não deve permitir criar serviço com duração estimada menor ou igual a zero", () => {
        expect(() => {
            new Service(validCategoryId, "Corte", 30, 0);
        }).toThrow(
            "A duração estimada deve ser um número inteiro maior que zero.",
        );

        expect(() => {
            new Service(validCategoryId, "Corte", 30, -5);
        }).toThrow(
            "A duração estimada deve ser um número inteiro maior que zero.",
        );
    });

    it("não deve permitir criar serviço com duração decimal", () => {
        expect(() => {
            new Service(validCategoryId, "Corte", 30, 30.5);
        }).toThrow(
            "A duração estimada deve ser um número inteiro maior que zero.",
        );
    });

    it("deve permitir alterar dados do serviço", () => {
        const service = new Service(validCategoryId, "Corte Simples", 30, 20);

        service.rename("Corte Tesoura");
        service.changePrice(40);
        service.changeEstimatedMinutes(35);
        service.changeDescription("Corte somente na tesoura");

        expect(service.getName()).toBe("Corte Tesoura");
        expect(service.getPrice()).toBe(40);
        expect(service.getEstimatedMinutes()).toBe(35);
        expect(service.getDescription()).toBe("Corte somente na tesoura");
    });

    it("deve permitir desativar e ativar o serviço", () => {
        const service = new Service(validCategoryId, "Corte", 30, 30);

        service.deactivate();
        expect(service.isActive()).toBe(false);

        service.activate();
        expect(service.isActive()).toBe(true);
    });

    it("deve restaurar um serviço existente", () => {
        const id = "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22";
        const service = Service.restore(
            id,
            validCategoryId,
            "Corte Degradê",
            45.0,
            40,
            true,
            "Descrição",
            "2026-10-12T14:44:19.000Z",
        );

        expect(service.getId()).toBe(id);
        expect(service.getName()).toBe("Corte Degradê");
        expect(service.isActive()).toBe(true);
        expect(service.getCreatedAt()).toBe("2026-10-12T14:44:19.000Z");
    });
});
