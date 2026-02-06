"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEdition } from "@/contexts/edition-context";
import { EditionProps } from "@/app/types/edition";
import { useAuth } from "@/contexts/auth-context";

export function EditionSwitcher({ editions }: { editions: EditionProps[] }) {
  const { isMobile } = useSidebar();
  const [activeEdition, setActiveEdition] = React.useState(editions[0]);
  const { changeEdition } = useEdition();
  const { user } = useAuth();

  if (!activeEdition) {
    return null;
  }

  if (user?.role === "STUDENT" || user?.role === "ALUMNI") {
    return (
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {activeEdition.number}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeEdition.name}</span>
            <span className="truncate text-xs">{activeEdition.location}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenu>
    );
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeEdition.number}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeEdition.name}
                </span>
                <span className="truncate text-xs">
                  {activeEdition.location}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Edições
            </DropdownMenuLabel>
            {editions.map((edition, index) => (
              <DropdownMenuItem
                key={edition.name}
                onClick={() => {
                  setActiveEdition(edition);
                  changeEdition(edition);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {edition.number}
                </div>
                {edition.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
