"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { BookingForm } from "@/components/BookingForm";
import { AppointmentsList } from "@/components/AppointmentsList";
import { api } from "@/services/api";
import { Category, Service, Appointment, CreateAppointmentDTO } from "@/types";
import { Sparkles, Calendar, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"agendar" | "meus-agendamentos">("agendar");

  // Dados da API
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Estados locais
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Carregar dados iniciais
  const loadInitialData = async () => {
    try {
      const [cats, servs, appts] = await Promise.all([
        api.getCategories().catch(() => []),
        api.getServices().catch(() => []),
        api.getAppointments().catch(() => []),
      ]);

      setCategories(cats);
      setServices(servs);
      setAppointments(appts);

      if (servs.length > 0 && !selectedService) {
        setSelectedService(servs[0]);
      }
    } catch (err: any) {
      console.error("Falha ao carregar dados:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Criar agendamento
  const handleCreateAppointment = async (dto: CreateAppointmentDTO) => {
    setIsLoading(true);
    try {
      const newAppointment = await api.createAppointment(dto);
      setAppointments((prev) => [newAppointment, ...prev]);
      showNotification("success", "Agendamento realizado com sucesso!");
      setActiveTab("meus-agendamentos");
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar para Concluído
  const handleCompleteAppointment = async (id: string) => {
    setIsLoading(true);
    try {
      const updated = await api.updateAppointmentStatus(id, "finalizado");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a))
      );
      showNotification("success", "Status atualizado para finalizado!");
    } catch (err: any) {
      showNotification("error", err.message || "Erro ao atualizar status.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar
  const handleCancelAppointment = async (id: string) => {
    setIsLoading(true);
    try {
      const updated = await api.cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a))
      );
      showNotification("success", "Agendamento cancelado com sucesso.");
    } catch (err: any) {
      showNotification("error", err.message || "Erro ao cancelar agendamento.");
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Deseja realmente remover este agendamento do histórico?")) {
      return;
    }

    setIsLoading(true);
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      showNotification("success", "Agendamento removido!");
    } catch (err: any) {
      showNotification("error", err.message || "Erro ao remover agendamento.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtragem de serviços por categoria
  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category_id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          appointmentsCount={appointments.filter((a) => a.status === "agendado").length}
        />

        {/* Notificação Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div
              className={`flex items-center gap-2.5 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-md ${
                notification.type === "success"
                  ? "border-emerald-500/50 bg-[#1A1D24] text-emerald-400"
                  : "border-red-500/50 bg-[#1A1D24] text-red-400"
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold text-white">{notification.message}</span>
            </div>
          </div>
        )}

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === "agendar" ? (
            <div>
              {/* Banner de Boas-Vindas */}
              <div className="relative overflow-hidden rounded-3xl border border-[#2C313C] bg-gradient-to-r from-[#1A1D24] via-[#1A1D24]/80 to-[#0F1115] p-8 mb-10 shadow-xl">
                <div className="max-w-2xl relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E58A2B]/30 bg-[#E58A2B]/10 px-3.5 py-1 text-xs font-bold text-[#E58A2B] mb-4">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Experiência & Estilo Premium</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Agende seu horário com os{" "}
                    <span className="text-[#E58A2B]">melhores profissionais</span>
                  </h1>
                  <p className="mt-3 text-sm text-[#9EA5B4] leading-relaxed">
                    Escolha o serviço desejado, confira os horários disponíveis em tempo real e garanta seu atendimento com facilidade e pontualidade.
                  </p>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none pr-8 hidden md:block">
                  <Layers className="h-72 w-72 text-[#E58A2B]" />
                </div>
              </div>

              {/* Grid Principal: Catálogo de Serviços e Formulário de Agendamento */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Coluna da Esquerda: Serviços e Categorias (7 colunas) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Seletor de Categorias */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border ${
                        selectedCategory === "all"
                          ? "border-[#E58A2B] bg-[#E58A2B] text-black shadow-md shadow-[#E58A2B]/20"
                          : "border-[#2C313C] bg-[#1A1D24] text-[#9EA5B4] hover:text-white hover:bg-[#222630]"
                      }`}
                    >
                      Todos os Serviços
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border ${
                          selectedCategory === cat.id
                            ? "border-[#E58A2B] bg-[#E58A2B] text-black shadow-md shadow-[#E58A2B]/20"
                            : "border-[#2C313C] bg-[#1A1D24] text-[#9EA5B4] hover:text-white hover:bg-[#222630]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Lista de Cards de Serviços */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          isSelected={selectedService?.id === service.id}
                          onSelect={setSelectedService}
                        />
                      ))
                    ) : (
                      <div className="col-span-full rounded-2xl border border-[#2C313C] bg-[#1A1D24] p-8 text-center text-sm text-[#9EA5B4]">
                        Nenhum serviço disponível nesta categoria.
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna da Direita: Formulário de Agendamento (5 colunas) */}
                <div className="lg:col-span-5 sticky top-24">
                  <BookingForm
                    selectedService={selectedService}
                    onSubmit={handleCreateAppointment}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Aba de Lista de Agendamentos */
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#2C313C] pb-5">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Calendar className="h-6 w-6 text-[#E58A2B]" />
                    <span>Meus Agendamentos</span>
                  </h2>
                  <p className="mt-1 text-xs text-[#9EA5B4]">
                    Gerencie seus horários, consulte confirmações e cancele se necessário.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-[#E58A2B] animate-pulse" />
                  <span className="text-xs font-semibold text-[#9EA5B4]">
                    {appointments.length} registrado(s)
                  </span>
                </div>
              </div>

              <AppointmentsList
                appointments={appointments}
                onCancel={handleCancelAppointment}
                onComplete={handleCompleteAppointment}
                onDelete={handleDeleteAppointment}
                isLoading={isLoading}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2C313C] bg-[#0F1115] py-6 text-center text-xs text-[#9EA5B4] mt-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 BarberShop Scheduling API — Todos os direitos reservados.</p>
          <div className="flex items-center gap-1.5 text-[#E58A2B] font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Integrado com Supabase & Express API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
