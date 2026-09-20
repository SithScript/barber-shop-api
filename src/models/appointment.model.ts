export interface Appointment {
    id: string;
    clientName: string;
    clientPhone: string;
    serviceId: string;
    dateTime: string; // Formato ISO: "YYYY-MM-DDTHH:mm:ss"
    status: "scheduled" | "completed" | "canceled"; 
    //Define o status do agendamento: agendado (scheduled), concluído (completed) ou cancelado (canceled)
}