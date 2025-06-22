import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DarkModeProvider } from "@/contexts/DarkModeContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HydroScribe - Intelligent Water Monitoring System",
  description: "Next-level water monitoring with AI-powered insights using AWS Bedrock and NVIDIA NIM APIs. Built for Amazon Hackathon 2025.",
  keywords: ["water monitoring", "IoT", "AWS Bedrock", "NVIDIA AI", "flood prevention", "smart agriculture"],
  authors: [{ name: "HydroScribe Team" }],
  openGraph: {
    title: "HydroScribe - Intelligent Water Monitoring",
    description: "Revolutionize water management with AI-powered insights and real-time monitoring",
    type: "website",
    siteName: "HydroScribe",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
