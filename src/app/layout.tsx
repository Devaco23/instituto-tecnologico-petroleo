// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["700", "900"],
  variable: '--font-poppins'
});

const openSans = Open_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "600"],
  variable: '--font-opensans'
});

export const metadata: Metadata = {
  title: "ITP CORE - Plataforma Académica",
  description: "Sistema Integral del Instituto Tecnológico del Petróleo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${openSans.variable}`}>
      <body className="font-opensans antialiased">
        {children}
      </body>
    </html>
  );
}