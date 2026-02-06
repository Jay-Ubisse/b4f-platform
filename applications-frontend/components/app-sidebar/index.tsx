"use client";

import * as React from "react";
import {
  Users,
  LayoutDashboard,
  CircleHelp,
  University,
  FileUser,
  Presentation,
  History,
  Plus,
  Globe,
  GraduationCap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { NavLinks } from "@/components/app-sidebar/nav-links";
import { NavUser } from "@/components/app-sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { EditionSwitcher } from "./edition-switcher";
import { getEditions } from "@/services/editions";
import { Icons } from "@/components/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import { NewEditionSheet } from "@/components/sheets/new-edition-sheet";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const t = useTranslations("Dashboard.SideBar");

  const data = {
    navMain: [
      {
        title: t("Overview"),
        url: "/dashboard/overview",
        icon: LayoutDashboard,
      },
      { title: t("Users"), url: "/dashboard/users", icon: Users },
      { title: t("Countries"), url: "/dashboard/countries", icon: Globe },
      { title: t("Courses"), url: "/dashboard/courses", icon: GraduationCap },
      { title: t("Editions"), url: "/dashboard/editions", icon: History },
      { title: t("Candidates"), url: "/dashboard/candidates", icon: FileUser },
      {
        title: t("Interviews"),
        url: "/dashboard/interviews",
        icon: Presentation,
      },
      { title: t("Classes"), url: "/dashboard/classes", icon: University },
      { title: t("Support"), url: "/dashboard/support", icon: CircleHelp },
    ],
  };

  const {
    isPending,
    error,
    data: editions,
  } = useQuery({
    queryKey: ["editions"],
    queryFn: () => getEditions(),
    refetchInterval: 5000,
  });

  return (
    <Sidebar
      collapsible="icon"
      className="
        border-r bg-background
        supports-[backdrop-filter]:bg-background/70 supports-[backdrop-filter]:backdrop-blur-xl
      "
      {...props}
    >
      <SidebarHeader className="px-3 pt-3">
        {isPending ? (
          <div className="flex items-center justify-center py-2">
            <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error || !editions || editions.length === 0 ? (
          <NewEditionSheet
            trigger={
              <div
                className="
                  group relative flex items-center gap-2 rounded-xl px-3 py-2
                  border bg-card/60 shadow-sm
                  hover:shadow-md transition
                  hover:border-primary/30
                  focus-within:ring-2 focus-within:ring-ring
                "
              >
                {/* glow */}
                <div
                  className="
                    pointer-events-none absolute inset-0 rounded-xl opacity-0
                    group-hover:opacity-100 transition
                    bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10
                  "
                />
                <span
                  className="
                    relative flex size-9 items-center justify-center rounded-lg
                    text-primary-foreground
                    bg-gradient-to-br from-primary to-secondary
                    shadow-sm ring-1 ring-white/10
                  "
                >
                  <Plus className="size-4" />
                </span>

                <div className="relative flex flex-col leading-tight">
                  <span className="text-sm font-semibold">
                    Criar nova edição
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Configure uma nova turma/edição
                  </span>
                </div>
              </div>
            }
          />
        ) : (
          <EditionSwitcher editions={editions} />
        )}
      </SidebarHeader>

      <SidebarContent className="mt-6 px-2">
        <NavLinks items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        {user ? (
          <NavUser user={user} />
        ) : (
          <p className="text-xs text-muted-foreground px-2">
            Sessão não iniciada
          </p>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
