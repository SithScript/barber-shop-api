"use client";

import React from "react";
import { Appointment, AppointmentStatus } from "@/types";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertTriangle, Trash2 } from "lucide-react";

interface AppointmentsListProps {
  appointments: Appointment[];
  onCancel: (id: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  onCancel,
  onComplete,
  onDelete,
  isLoading,
}) => {
  if (appointments.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2C313C] bg-[#1A1D24] p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1115] border border-[#2C313C] text-[#E58A2B] mb-4">
          <Calendar className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Nenhum agendamento encontrado</h3>
        <p className="mt-1 text-sm text-[#9EA5B4] max-w-sm mx-auto">
          Você ainda não possui horários agendados. Utilize a aba &quot;Novo Agendamento&quot; para reservar.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "agendado":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E58A2B]/30 bg-[#E58A2B]/10 px-3 py-1 text-xs font-bold text-[#E58A2B]">
            <Clock className="h-3 w-3" />
            Agendado
          </span>
        );
      case "finalizado":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <CheckCircle className="h-3 w-3" />
            Finalizado
          </span>
        );
      case "cancelado":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
            <XCircle className="h-3 w-3" />
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const dateFormatted = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeFormatted = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { dateFormatted, timeFormatted };
    } catch {
      return { dateFormatted: isoString, timeFormatted: "" };
    }
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const { dateFormatted, timeFormatted } = formatDateTime(appointment.date_time);

        return (
          <div
            key={appointment.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#2C313C] bg-[#1A1D24] p-5 transition-all hover:border-[#E58A2B]/30"
          >
            {/* Informações Principais */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h4 className="text-base font-bold text-white">
                  {appointment.services?.name || "Serviço da Barbearia"}
                </h4>
                {getStatusBadge(appointment.status)}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#9EA5B4]">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#E58A2B]" />
                  <span>{appointment.client_name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#E58A2B]" />
                  <span>{appointment.client_phone}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#E58A2B]" />
                  <span>
                    {dateFormatted} às {timeFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-[#2C313C]/50 sm:border-0 pt-3 sm:pt-0">
              {appointment.status === "agendado" && (
                <>
                  <button
                    onClick={() => onComplete(appointment.id)}
                    disabled={isLoading}
                    title="Marcar como finalizado"
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Concluir</span>
                  </button>

                  <button
                    onClick={() => onCancel(appointment.id)}
                    disabled={isLoading}
                    title="Cancelar agendamento"
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Cancelar</span>
                  </button>
                </>
              )}

              <button
                onClick={() => onDelete(appointment.id)}
                disabled={isLoading}
                title="Excluir do histórico"
                className="flex items-center gap-1 rounded-lg border border-[#2C313C] p-2 text-xs text-[#9EA5B4] hover:border-red-500/50 hover:text-red-400 hover:bg-[#222630] transition-all disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
