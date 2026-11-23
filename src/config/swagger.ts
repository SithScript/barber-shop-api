// ====================================================================
// Documentação com Swagger / OpenAPI
// ====================================================================

import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Barbershop Scheduling API",
            version: "1.0.0",
            description:
                "API REST para gerenciamento de categorias, serviços e agendamentos de uma barbearia com persistência no Supabase.",
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Servidor local de desenvolvimento",
            },
        ],
        tags: [
            {
                name: "Categories",
                description: "Gerenciamento de categorias de serviços",
            },
            {
                name: "Services",
                description: "Gerenciamento do catálogo de serviços da barbearia",
            },
            {
                name: "Appointments",
                description: "Gerenciamento de agendamentos e horários",
            },
        ],
        components: {
            schemas: {
                Category: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                        },
                        name: {
                            type: "string",
                            example: "Cabelo",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            example: "Cortes e tratamentos capilares diversos",
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            example: "2026-10-12T14:44:19.000Z",
                        },
                    },
                },

                CreateCategory: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            minLength: 1,
                            example: "Cabelo",
                        },
                        description: {
                            type: "string",
                            example: "Cortes e tratamentos capilares diversos",
                        },
                    },
                },

                UpdateCategory: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            minLength: 1,
                            example: "Cabelo & Barba",
                        },
                        description: {
                            type: "string",
                            example: "Serviços combinados para cabelo e barba",
                        },
                    },
                },

                Service: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            example: "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22",
                        },
                        category_id: {
                            type: "string",
                            format: "uuid",
                            example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                        },
                        name: {
                            type: "string",
                            example: "Corte Degradê",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            example: "Corte moderno com acabamento na navalha",
                        },
                        price: {
                            type: "number",
                            minimum: 0,
                            example: 45.0,
                        },
                        estimated_minutes: {
                            type: "integer",
                            minimum: 1,
                            example: 40,
                        },
                        is_active: {
                            type: "boolean",
                            example: true,
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            example: "2026-10-12T14:44:19.000Z",
                        },
                    },
                },

                CreateService: {
                    type: "object",
                    required: ["category_id", "name", "price", "estimated_minutes"],
                    properties: {
                        category_id: {
                            type: "string",
                            format: "uuid",
                            example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                        },
                        name: {
                            type: "string",
                            minLength: 1,
                            example: "Corte Degradê",
                        },
                        description: {
                            type: "string",
                            example: "Corte moderno com acabamento na navalha",
                        },
                        price: {
                            type: "number",
                            minimum: 0,
                            example: 45.0,
                        },
                        estimated_minutes: {
                            type: "integer",
                            minimum: 1,
                            example: 40,
                        },
                        is_active: {
                            type: "boolean",
                            default: true,
                            example: true,
                        },
                    },
                },

                UpdateService: {
                    type: "object",
                    properties: {
                        category_id: {
                            type: "string",
                            format: "uuid",
                            example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                        },
                        name: {
                            type: "string",
                            minLength: 1,
                            example: "Corte Degradê Premium",
                        },
                        description: {
                            type: "string",
                            example: "Corte moderno com acabamento na navalha e lavagem",
                        },
                        price: {
                            type: "number",
                            minimum: 0,
                            example: 50.0,
                        },
                        estimated_minutes: {
                            type: "integer",
                            minimum: 1,
                            example: 45,
                        },
                        is_active: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },

                Appointment: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            example: "7a17ac32-8e01-4c44-8f15-aa72e7ba1f49",
                        },
                        service_id: {
                            type: "string",
                            format: "uuid",
                            example: "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22",
                        },
                        client_name: {
                            type: "string",
                            example: "Lucas Gabriel",
                        },
                        client_phone: {
                            type: "string",
                            example: "41999998888",
                        },
                        date_time: {
                            type: "string",
                            format: "date-time",
                            example: "2026-10-15T14:30:00",
                        },
                        status: {
                            type: "string",
                            enum: ["agendado", "finalizado", "cancelado"],
                            example: "agendado",
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            example: "2026-10-12T14:44:19.000Z",
                        },
                    },
                },

                CreateAppointment: {
                    type: "object",
                    required: ["service_id", "client_name", "client_phone", "date_time"],
                    properties: {
                        service_id: {
                            type: "string",
                            format: "uuid",
                            example: "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22",
                        },
                        client_name: {
                            type: "string",
                            minLength: 1,
                            example: "Lucas Gabriel",
                        },
                        client_phone: {
                            type: "string",
                            minLength: 1,
                            example: "41999998888",
                        },
                        date_time: {
                            type: "string",
                            example: "2026-10-15T14:30:00",
                        },
                        status: {
                            type: "string",
                            enum: ["agendado", "finalizado", "cancelado"],
                            default: "agendado",
                            example: "agendado",
                        },
                    },
                },

                UpdateAppointment: {
                    type: "object",
                    properties: {
                        service_id: {
                            type: "string",
                            format: "uuid",
                            example: "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22",
                        },
                        client_name: {
                            type: "string",
                            example: "Lucas Gabriel Silva",
                        },
                        client_phone: {
                            type: "string",
                            example: "41988887777",
                        },
                        date_time: {
                            type: "string",
                            example: "2026-10-15T15:00:00",
                        },
                        status: {
                            type: "string",
                            enum: ["agendado", "finalizado", "cancelado"],
                            example: "agendado",
                        },
                    },
                },

                UpdateAppointmentStatus: {
                    type: "object",
                    required: ["status"],
                    properties: {
                        status: {
                            type: "string",
                            enum: ["agendado", "finalizado", "cancelado"],
                            example: "finalizado",
                        },
                    },
                },

                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Mensagem descritiva do erro",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
