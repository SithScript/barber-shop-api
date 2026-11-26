import { Category, Service, Appointment, CreateAppointmentDTO } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMessage = "Ocorreu um erro na requisição.";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // fallback
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export const api = {
  // Categorias
  getCategories: () => request<Category[]>("/categories"),
  getCategoryById: (id: string) => request<Category>(`/categories/${id}`),

  // Serviços
  getServices: () => request<Service[]>("/services"),
  getServiceById: (id: string) => request<Service>(`/services/${id}`),
  getServicesByCategory: (categoryId: string) =>
    request<Service[]>(`/services/category/${categoryId}`),

  // Agendamentos
  getAppointments: () => request<Appointment[]>("/appointments"),
  getAppointmentById: (id: string) =>
    request<Appointment>(`/appointments/${id}`),
  createAppointment: (data: CreateAppointmentDTO) =>
    request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAppointmentStatus: (id: string, status: "agendado" | "finalizado" | "cancelado") =>
    request<Appointment>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  cancelAppointment: (id: string) =>
    request<Appointment>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelado" }),
    }),
  deleteAppointment: (id: string) =>
    request<{ message: string }>(`/appointments/${id}`, {
      method: "DELETE",
    }),
};
