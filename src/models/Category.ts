import { ValidationError } from "../errors/ValidationErrors.js";

export class Category {
    private id: string | undefined;
    private name: string;
    private description: string | undefined;
    private created_at: string | undefined;

    constructor(name: string, description?: string) {
        this.id = undefined;
        this.name = "";
        this.description = description;
        this.created_at = undefined;

        this.rename(name);
    }

    static restore(
        id: string,
        name: string,
        description?: string,
        created_at?: string,
    ): Category {
        const category = new Category(name, description);
        category.id = id;
        category.created_at = created_at;
        return category;
    }

    getId(): string | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getCreatedAt(): string | undefined {
        return this.created_at;
    }

    rename(name: string): void {
        if (typeof name !== "string" || name.trim().length === 0) {
            throw new ValidationError("O nome da categoria é obrigatório.");
        }

        this.name = name.trim();
    }

    changeDescription(description?: string): void {
        this.description = description;
    }
}
