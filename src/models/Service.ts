import { ValidationError } from "../errors/ValidationErrors.js";

const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class Service {
    private id: string | undefined;
    private category_id: string;
    private name: string;
    private price: number;
    private estimated_minutes: number;
    private is_active: boolean;
    private description: string | undefined;
    private created_at: string | undefined;

    constructor(
        category_id: string,
        name: string,
        price: number,
        estimated_minutes: number,
        description?: string,
        is_active: boolean = true,
    ) {
        this.id = undefined;
        this.category_id = "";
        this.name = "";
        this.price = 0;
        this.estimated_minutes = 0;
        this.is_active = is_active;
        this.description = description;
        this.created_at = undefined;

        this.changeCategory(category_id);
        this.rename(name);
        this.changePrice(price);
        this.changeEstimatedMinutes(estimated_minutes);
    }

    static restore(
        id: string,
        category_id: string,
        name: string,
        price: number,
        estimated_minutes: number,
        is_active: boolean = true,
        description?: string,
        created_at?: string,
    ): Service {
        const service = new Service(
            category_id,
            name,
            price,
            estimated_minutes,
            description,
            is_active,
        );

        service.id = id;
        service.created_at = created_at;
        return service;
    }

    getId(): string | undefined {
        return this.id;
    }

    getCategoryId(): string {
        return this.category_id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getPrice(): number {
        return this.price;
    }

    getEstimatedMinutes(): number {
        return this.estimated_minutes;
    }

    isActive(): boolean {
        return this.is_active;
    }

    getCreatedAt(): string | undefined {
        return this.created_at;
    }

    changeCategory(category_id: string): void {
        if (typeof category_id !== "string" || category_id.trim().length === 0) {
            throw new ValidationError("A categoria do serviço é obrigatória.");
        }

        if (!uuidRegex.test(category_id.trim())) {
            throw new ValidationError(
                "O identificador da categoria deve ser um UUID válido.",
            );
        }

        this.category_id = category_id.trim();
    }

    rename(name: string): void {
        if (typeof name !== "string" || name.trim().length === 0) {
            throw new ValidationError("O nome do serviço é obrigatório.");
        }

        this.name = name.trim();
    }

    changePrice(price: number): void {
        if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
            throw new ValidationError(
                "O preço do serviço deve ser um número maior ou igual a zero.",
            );
        }

        this.price = price;
    }

    changeEstimatedMinutes(minutes: number): void {
        if (!Number.isInteger(minutes) || minutes <= 0) {
            throw new ValidationError(
                "A duração estimada deve ser um número inteiro maior que zero.",
            );
        }

        this.estimated_minutes = minutes;
    }

    changeDescription(description?: string): void {
        this.description = description;
    }

    activate(): void {
        this.is_active = true;
    }

    deactivate(): void {
        this.is_active = false;
    }
}
