export interface Appointment {
    id?: string;
    clientName: string;
    clientPhone: string;
    serviceId: string;
    dateTime: string; // Formato ISO: "YYYY-MM-DDTHH:mm:ss"
    status?: "agendado" | "finalizado" | "cancelado"; 
    //Define o status do agendamento: agendado (scheduled), concluído (completed) ou cancelado (canceled)
    created_at?: string;
}