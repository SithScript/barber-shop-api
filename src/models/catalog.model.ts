export interface Category {
    id: string;
    name: string; // Ex: "Cabelo", "Barba", "Tratamentos"
    description?: string;
}

export interface Service {
    id: string;
    categoryId: string; // Relacionamento (1 Categoria -> N Serviços)
    name: string; // Ex: "Corte Social", "Barba Terapia"
    description: string;
    price: number; // Ex: 45.00
    estimatedMinutes: number; // Ex: 30
    available: boolean;
}
