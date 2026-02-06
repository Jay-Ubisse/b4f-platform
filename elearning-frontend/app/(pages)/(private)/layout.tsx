"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Icons } from "@/components/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { getEditions } from "@/services/edition";
import { useEdition } from "@/contexts/edition-context";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { changeEdition } = useEdition();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }

    async function setEdition() {
      const editions = await getEditions();

      if (!editions) {
        changeEdition(null);
      } else {
        changeEdition(
          editions[editions.length - 1] //iniciar com a última edição
        );
      }
    }

    setEdition();
  }, [loading, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center px-4 py-2 w-screen h-screen">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="w-fit fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
