import { Category, Service } from "../models/catalog.model.js";

// Simulação de banco de dados em memória
export const categoriesRepository: Category[] = [
    { id: "1", name: "Cabelo", description: "Cortes e finalizações" },
    { id: "2", name: "Barba", description: "Cuidados com a barba e toalha quente" }
];

export const servicesRepository: Service[] = [
    {
        id: "101",
        categoryId: "1",
        name: "Corte Social",
        description: "Corte tradicional com tesoura e máquina",
        price: 40.00,
        estimatedMinutes: 30,
        available: true
    },
    {
        id: "102",
        categoryId: "2",
        name: "Barba Terapia",
        description: "Modelagem de barba com hidratação e toalha quente",
        price: 35.00,
        estimatedMinutes: 25,
        available: true
    }
];