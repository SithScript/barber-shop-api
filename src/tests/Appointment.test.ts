import { describe, it, expect } from "vitest";
import { Appointment } from "../models/Appointment.js";

describe("Appointment - Testes Unitários", () => {
    const validServiceId = "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22";

    it("deve criar um agendamento válido", () => {
        const appointment = new Appointment(
            validServiceId,
            "Lucas Gabriel",
            "41999998888",
            "2026-10-15T14:30:00",
        );

        expect(appointment.getServiceId()).toBe(validServiceId);
        expect(appointment.getClientName()).toBe("Lucas Gabriel");
        expect(appointment.getClientPhone()).toBe("41999998888");
        expect(appointment.getDateTime()).toBe("2026-10-15T14:30:00");
        expect(appointment.getStatus()).toBe("agendado");
        expect(appointment.getId()).toBeUndefined();
    });

    it("não deve permitir serviço inválido (não-UUID)", () => {
        expect(() => {
            new Appointment(
                "invalido",
                "Lucas",
                "41999998888",
                "2026-10-15T14:30:00",
            );
        }).toThrow("O identificador do serviço deve ser um UUID válido.");
    });

    it("não deve permitir criar agendamento com nome do cliente vazio", () => {
        expect(() => {
            new Appointment(
                validServiceId,
                "   ",
                "41999998888",
                "2026-10-15T14:30:00",
            );
        }).toThrow("O nome do cliente é obrigatório.");
    });

    it("não deve permitir criar agendamento com telefone do cliente vazio", () => {
        expect(() => {
            new Appointment(
                validServiceId,
                "Lucas",
                "",
                "2026-10-15T14:30:00",
            );
        }).toThrow("O telefone do cliente é obrigatório.");
    });

    it("não deve permitir criar agendamento com data/hora inválida", () => {
        expect(() => {
            new Appointment(
                validServiceId,
                "Lucas",
                "41999998888",
                "data-invalida",
            );
        }).toThrow("A data e hora informada é inválida.");
    });

    it("não deve permitir criar agendamento com status inválido", () => {
        expect(() => {
            new Appointment(
                validServiceId,
                "Lucas",
                "41999998888",
                "2026-10-15T14:30:00",
                "status_qualquer" as any,
            );
        }).toThrow(
            "Status inválido. Deve ser 'agendado', 'finalizado' ou 'cancelado'.",
        );
    });

    it("deve permitir reagendar a data e hora", () => {
        const appointment = new Appointment(
            validServiceId,
            "Lucas",
            "41999998888",
            "2026-10-15T14:30:00",
        );

        appointment.reschedule("2026-10-16T10:00:00");
        expect(appointment.getDateTime()).toBe("2026-10-16T10:00:00");
    });

    it("deve permitir atualizar status usando complete() e cancel()", () => {
        const appointment = new Appointment(
            validServiceId,
            "Lucas",
            "41999998888",
            "2026-10-15T14:30:00",
        );

        appointment.complete();
        expect(appointment.getStatus()).toBe("finalizado");

        appointment.cancel();
        expect(appointment.getStatus()).toBe("cancelado");
    });

    it("deve restaurar um agendamento existente", () => {
        const id = "7a17ac32-8e01-4c44-8f15-aa72e7ba1f49";
        const appointment = Appointment.restore(
            id,
            validServiceId,
            "Lucas",
            "41999998888",
            "2026-10-15T14:30:00",
            "finalizado",
            "2026-10-12T14:44:19.000Z",
        );

        expect(appointment.getId()).toBe(id);
        expect(appointment.getStatus()).toBe("finalizado");
        expect(appointment.getCreatedAt()).toBe("2026-10-12T14:44:19.000Z");
    });
});
