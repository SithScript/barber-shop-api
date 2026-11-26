export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  estimated_minutes: number;
  is_active: boolean;
  created_at?: string;
  categories?: {
    name: string;
  };
}

export type AppointmentStatus = "agendado" | "finalizado" | "cancelado";

export interface Appointment {
  id: string;
  service_id: string;
  client_name: string;
  client_phone: string;
  date_time: string;
  status: AppointmentStatus;
  created_at?: string;
  services?: {
    name: string;
    price: number;
  };
}

export interface CreateAppointmentDTO {
  service_id: string;
  client_name: string;
  client_phone: string;
  date_time: string;
}
