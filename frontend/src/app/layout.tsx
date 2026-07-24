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
  title: "Voltlyzer LC - Sistema de Monitoreo Predictivo de Red Eléctrica",
  description: "Monitoreo y predicción en tiempo real del riesgo de fallas e interrupciones eléctricas por colonia en Lázaro Cárdenas, Michoacán.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/LOGO_VOLTLYZER_LC.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Voltlyzer LC - Monitoreo Predictivo de Red Eléctrica",
    description: "Predicción en tiempo real del riesgo de fallas e interrupciones eléctricas por colonia en Lázaro Cárdenas, Michoacán.",
    url: "https://voltlyzer-lc.vercel.app",
    siteName: "Voltlyzer LC",
    images: [
      {
        url: "https://voltlyzer-lc.vercel.app/LOGO_VOLTLYZER_LC.png",
        width: 1200,
        height: 630,
        alt: "Voltlyzer LC Logo y Vista Previa Social",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voltlyzer LC - Monitoreo Predictivo de Red Eléctrica",
    description: "Predicción en tiempo real del riesgo de fallas eléctricas por colonia en Lázaro Cárdenas, Mich.",
    images: ["https://voltlyzer-lc.vercel.app/LOGO_VOLTLYZER_LC.png"],
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
      <body className="min-h-full flex flex-col bg-[#0D0E11] text-white">{children}</body>
    </html>
  );
}
