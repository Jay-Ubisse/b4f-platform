"use client";

import * as React from "react";
import {
  Dumbbell,
  LayoutDashboard,
  CircleHelp,
  BookOpenCheck,
  CalendarDays,
  FileUser,
  AlignEndVertical,
} from "lucide-react";
import { NavLinks } from "@/components/app-sidebar/nav-links";
import { NavUser } from "@/components/app-sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";

// This is sample data.
const data = {
  user: {
    name: "Joaquim Ubisse",
    email: "joaquimubisse@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Visão Geral",
      url: "/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Alunos",
      url: "/students",
      icon: FileUser,
    },
    {
      title: "Calendário",
      url: "/calendar",
      icon: CalendarDays,
    },
    {
      title: "Módulos",
      url: "/modules",
      icon: BookOpenCheck,
    },
    {
      title: "Quizzes",
      url: "/quizzes-management",
      icon: AlignEndVertical,
    },
    {
      title: "Exercícios",
      url: "/exercises",
      icon: Dumbbell,
    },
    {
      title: "Dúvidas",
      url: "/doubts",
      icon: CircleHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
        {/** {isPending ? (
          <Icons.spinner className="h-6 w-6 animate-spin text-primary mx-auto" />
        ) : error || !editions || editions.length === 0 ? (
          <p>Erro</p>
        ) : (
          <EditionSwitcher editions={editions} />
        )} */}
      </SidebarHeader>
      <SidebarContent className="mt-10">
        <NavLinks items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
