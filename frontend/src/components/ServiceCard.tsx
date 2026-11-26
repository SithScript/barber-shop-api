import React from "react";
import { Service } from "@/types";
import { Clock, Check, Scissors } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(service)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-[#E58A2B] bg-[#1A1D24] shadow-xl shadow-[#E58A2B]/10 ring-1 ring-[#E58A2B]"
          : "border-[#2C313C] bg-[#1A1D24]/80 hover:border-[#E58A2B]/50 hover:bg-[#222630]"
      }`}
    >
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                isSelected
                  ? "bg-[#E58A2B] text-black"
                  : "bg-[#222630] text-[#E58A2B] group-hover:bg-[#E58A2B]/20"
              }`}
            >
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-[#E58A2B] transition-colors">
                {service.name}
              </h3>
              {service.categories?.name && (
                <span className="text-xs font-medium text-[#9EA5B4] uppercase tracking-wider">
                  {service.categories.name}
                </span>
              )}
            </div>
          </div>

          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
              isSelected
                ? "border-[#E58A2B] bg-[#E58A2B] text-black"
                : "border-[#2C313C] bg-transparent group-hover:border-[#E58A2B]/40"
            }`}
          >
            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Descrição */}
        {service.description && (
          <p className="mt-3 text-xs text-[#9EA5B4] leading-relaxed line-clamp-2">
            {service.description}
          </p>
        )}
      </div>

      {/* Rodapé: Duração e Preço */}
      <div className="mt-5 flex items-center justify-between border-t border-[#2C313C]/60 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-[#9EA5B4]">
          <Clock className="h-3.5 w-3.5 text-[#E58A2B]" />
          <span>{service.estimated_minutes} min</span>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#9EA5B4] mr-1">R$</span>
          <span className="text-lg font-extrabold text-[#E58A2B]">
            {Number(service.price).toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  );
};
