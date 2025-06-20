import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doutor Agenda",
  description: "Doutor Agenda - Gerenciamento de consultas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} antialiased`}>
        {children}
        <Toaster position="bottom-center" richColors theme="light" />
      </body>
    </html>
  );
}
