import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberShop API - Sistema de Agendamentos",
  description: "Plataforma moderna de agendamentos e catálogo de serviços da barbearia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0F1115] text-white antialiased selection:bg-[#E58A2B] selection:text-black">
        {children}
      </body>
    </html>
  );
}
