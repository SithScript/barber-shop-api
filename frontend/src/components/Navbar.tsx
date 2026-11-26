import React from "react";
import { Scissors, Calendar, Clock } from "lucide-react";

interface NavbarProps {
  activeTab: "agendar" | "meus-agendamentos";
  setActiveTab: (tab: "agendar" | "meus-agendamentos") => void;
  appointmentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  appointmentsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2C313C] bg-[#0F1115]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E58A2B] to-[#C26B15] shadow-lg shadow-[#E58A2B]/20">
            <Scissors className="h-6 w-6 text-black transform -rotate-45" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">
              BARBER<span className="text-[#E58A2B]">SHOP</span>
            </span>
            <span className="text-xs text-[#9EA5B4] font-medium tracking-wider uppercase">
              Cortes & Barbaterapia
            </span>
          </div>
        </div>

        {/* Abas de Navegação */}
        <nav className="flex items-center gap-2 rounded-xl bg-[#1A1D24] p-1.5 border border-[#2C313C]">
          <button
            onClick={() => setActiveTab("agendar")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "agendar"
                ? "bg-[#E58A2B] text-black shadow-md shadow-[#E58A2B]/25"
                : "text-[#9EA5B4] hover:text-white hover:bg-[#222630]"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Novo Agendamento</span>
          </button>

          <button
            onClick={() => setActiveTab("meus-agendamentos")}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "meus-agendamentos"
                ? "bg-[#E58A2B] text-black shadow-md shadow-[#E58A2B]/25"
                : "text-[#9EA5B4] hover:text-white hover:bg-[#222630]"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Agendamentos</span>
            {appointmentsCount > 0 && (
              <span
                className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  activeTab === "meus-agendamentos"
                    ? "bg-black text-[#E58A2B]"
                    : "bg-[#E58A2B] text-black"
                }`}
              >
                {appointmentsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
