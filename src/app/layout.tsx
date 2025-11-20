import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";

export const metadata: Metadata = {
  title: "Rentabili",
  description: "Simulador de investimentos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;  // ← TIPAGEM CORRETA
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
