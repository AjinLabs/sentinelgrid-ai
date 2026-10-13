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
  title: "SentinelGrid — AI Disaster Intelligence & Emergency Response OS",
  description:
    "Unified disaster intelligence platform for hazard monitoring, predictive risk analysis, resource allocation, incident coordination, and digital disaster twin simulation.",
  keywords: [
    "Disaster Intelligence",
    "Emergency Management",
    "Flood Risk AI",
    "Landslide Susceptibility",
    "Geospatial AI",
    "Multi-Agent Emergency Response",
    "Kerala Disaster Management",
    "Digital Disaster Twin",
  ],
  authors: [{ name: "SentinelGrid Command Systems" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col bg-[#0A0F1D] text-[#F1F5F9] selection:bg-[#245BDB] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
