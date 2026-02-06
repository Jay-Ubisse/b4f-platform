import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import "./globals.css";
import { ReactHotToaster } from "@/providers/toaster-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { EditionProvider } from "@/contexts/edition-contentx";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/providers/theme-provider";

const locales = ["en", "pt", "fr", "ar"];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candidaturas B4F",
  description: "Plataforma de Candidaturas da Bytes4Future",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <EditionProvider>
              <ReactQueryProvider>
                <ReactHotToaster />
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
              </ReactQueryProvider>
            </EditionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
