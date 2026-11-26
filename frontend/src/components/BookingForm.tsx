"use client";

import React, { useState, useEffect } from "react";
import { Service, CreateAppointmentDTO } from "@/types";
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface BookingFormProps {
  selectedService: Service | null;
  onSubmit: (data: CreateAppointmentDTO) => Promise<void>;
  isLoading: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedService,
  onSubmit,
  isLoading,
}) => {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [todayString, setTodayString] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTodayString(new Date().toISOString().split("T")[0]);
  }, []);

  // Lista de horários sugeridos comuns de barbearia
  const availableTimes = [
    "09:00", "09:40", "10:20", "11:00", "11:40",
    "13:30", "14:15", "15:00", "15:45", "16:30",
    "17:15", "18:00", "18:45", "19:30"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedService) {
      setError("Por favor, selecione um serviço no cardápio acima.");
      return;
    }
    if (!clientName.trim()) {
      setError("Informe seu nome completo.");
      return;
    }
    if (!clientPhone.trim()) {
      setError("Informe seu telefone de contato.");
      return;
    }
    if (!date) {
      setError("Escolha a data do agendamento.");
      return;
    }
    if (!time) {
      setError("Escolha o horário de atendimento.");
      return;
    }

    // Monta a data no formato ISO compatível com o backend ("YYYY-MM-DDTHH:mm:ss")
    const dateTime = `${date}T${time}:00`;

    try {
      await onSubmit({
        service_id: selectedService.id,
        client_name: clientName,
        client_phone: clientPhone,
        date_time: dateTime,
      });

      // Limpar formulário
      setClientName("");
      setClientPhone("");
      setDate("");
      setTime("");
    } catch (err: any) {
      setError(err.message || "Não foi possível confirmar o agendamento.");
    }
  };

  // Form render

  return (
    <div className="rounded-3xl border border-[#2C313C] bg-[#1A1D24] p-6 sm:p-8 shadow-2xl">
      <div className="border-b border-[#2C313C] pb-5 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#E58A2B]" />
          <span>Finalizar Agendamento</span>
        </h2>
        <p className="mt-1 text-xs text-[#9EA5B4]">
          Confirme seus dados e reserve seu horário exclusivo
        </p>
      </div>

      {/* Resumo do Serviço Selecionado */}
      <div className="mb-6 rounded-2xl border border-[#2C313C] bg-[#0F1115] p-4">
        {selectedService ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#9EA5B4] font-semibold">
                Serviço Selecionado
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {selectedService.name}
              </h4>
              <span className="text-xs text-[#9EA5B4]">
                Duração estimada: {selectedService.estimated_minutes} minutos
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#9EA5B4] block">Valor</span>
              <span className="text-xl font-extrabold text-[#E58A2B]">
                R$ {Number(selectedService.price).toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-[#9EA5B4]">
            <AlertCircle className="h-5 w-5 text-[#E58A2B]" />
            <span>Nenhum serviço selecionado. Clique em um dos serviços acima.</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome do Cliente */}
        <div>
          <label className="block text-xs font-semibold text-[#9EA5B4] uppercase tracking-wider mb-2">
            Seu Nome
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9EA5B4]" />
            <input
              type="text"
              placeholder="Ex: Lucas Gabriel"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-[#2C313C] bg-[#0F1115] pl-10 pr-4 py-3 text-sm text-white placeholder-[#9EA5B4]/50 focus:border-[#E58A2B] focus:outline-none focus:ring-1 focus:ring-[#E58A2B] transition-all"
            />
          </div>
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-xs font-semibold text-[#9EA5B4] uppercase tracking-wider mb-2">
            Telefone / WhatsApp
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9EA5B4]" />
            <input
              type="tel"
              placeholder="(41) 99999-8888"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full rounded-xl border border-[#2C313C] bg-[#0F1115] pl-10 pr-4 py-3 text-sm text-white placeholder-[#9EA5B4]/50 focus:border-[#E58A2B] focus:outline-none focus:ring-1 focus:ring-[#E58A2B] transition-all"
            />
          </div>
        </div>

        {/* Data */}
        <div>
          <label className="block text-xs font-semibold text-[#9EA5B4] uppercase tracking-wider mb-2">
            Data Desejada
          </label>
          <input
            type="date"
            min={todayString}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-[#2C313C] bg-[#0F1115] px-4 py-3 text-sm text-white focus:border-[#E58A2B] focus:outline-none focus:ring-1 focus:ring-[#E58A2B] transition-all [color-scheme:dark]"
          />
        </div>

        {/* Horários disponíveis */}
        <div>
          <label className="block text-xs font-semibold text-[#9EA5B4] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#E58A2B]" />
            <span>Horário Disponível</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {availableTimes.map((slot) => {
              const isSelected = time === slot;
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all text-center ${
                    isSelected
                      ? "border-[#E58A2B] bg-[#E58A2B] text-black shadow-md shadow-[#E58A2B]/20"
                      : "border-[#2C313C] bg-[#0F1115] text-[#9EA5B4] hover:border-[#E58A2B]/40 hover:text-white"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isLoading || !selectedService}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E58A2B] to-[#F3A145] py-3.5 px-6 font-bold text-black shadow-lg shadow-[#E58A2B]/20 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <span>Processando agendamento...</span>
          ) : (
            <>
              <span>Confirmar Agendamento</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
