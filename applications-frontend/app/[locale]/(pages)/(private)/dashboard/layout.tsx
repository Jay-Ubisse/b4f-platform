"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { Icons } from "@/components/loading-spinner";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useEdition } from "@/contexts/edition-contentx";
import LanguageSwitcher from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { edition } = useEdition(); // 👈 estado reativo
  const router = useRouter();

  /**
   * 1️⃣ Proteção de rota
   */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  /**
   * 2️⃣ Reação à mudança de edição
   */
  useEffect(() => {
    if (!edition) {
      console.warn("Nenhuma edição ativa");
      // exemplos de reação:
      // router.push("/dashboard/select-edition");
      // ou mostrar modal / toast
    }

    if (edition) {
      console.log("Edição ativa:", edition);
      // carregar dados dependentes da edição
      // refetch queries
    }
  }, [edition]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
