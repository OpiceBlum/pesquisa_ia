import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Diagnóstico: descubra se sua empresa precisa de governança de IA",
  description: "Descubra em qual nível de governança de IA sua organização se encontra",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR " className="dark-theme">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta charSet="UTF-8"/>
        <link rel='icon' href='./img/olho_verde.png'/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
