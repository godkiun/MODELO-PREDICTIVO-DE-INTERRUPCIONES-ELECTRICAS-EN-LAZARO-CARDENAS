import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monitor de Apagones - Lázaro Cárdenas",
  description: "Predicción en tiempo real del riesgo de apagones por colonia en Lázaro Cárdenas, Michoacán.",
  openGraph: {
    title: "Monitor de Apagones - Lázaro Cárdenas",
    description: "Predicción en tiempo real del riesgo de apagones por colonia.",
    url: "https://monitor-lazarocardenas.vercel.app",
    siteName: "Monitor de Apagones",
    images: [
      {
        url: "https://monitor-lazarocardenas.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
