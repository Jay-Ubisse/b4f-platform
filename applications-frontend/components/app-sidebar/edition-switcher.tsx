"use client";

import { useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEdition } from "@/contexts/edition-contentx";
import { EditionProps, EditionStatus } from "@/app/types/edition";
import { useAuth } from "@/contexts/auth-context";
import { NewEditionSheet } from "../sheets/new-edition-sheet";

export function EditionSwitcher({ editions }: { editions: EditionProps[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useSidebar();
  const { user } = useAuth();
  const { changeEdition, edition } = useEdition();

  if (!edition) return null;

  const activeEditions = editions.filter(
    (edition) => edition.applicationsStatus === EditionStatus.OPEN,
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                relative overflow-hidden rounded-xl
                border bg-card/60 shadow-sm
                hover:shadow-md transition
                data-[state=open]:border-primary/30
                data-[state=open]:ring-2 data-[state=open]:ring-ring
              "
            >
              {/* subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 data-[state=open]:opacity-100 transition" />

              <div
                className="
                  relative flex aspect-square size-9 items-center justify-center rounded-lg
                  text-primary-foreground font-semibold
                  bg-gradient-to-br from-primary to-secondary
                  shadow-sm ring-1 ring-white/10
                "
              >
                {edition.number}
              </div>

              <div className="relative grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{edition.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {edition.course.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {edition.location.name}
                </span>
              </div>

              <ChevronsUpDown className="relative ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="
              w-fit min-w-60 rounded-xl border
              bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl
              shadow-xl
            "
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Edições ativas
            </DropdownMenuLabel>

            {activeEditions.map((ed, index) => (
              <DropdownMenuItem
                key={ed.id}
                onClick={() => changeEdition(ed)}
                className="
                  gap-2 p-2 rounded-lg cursor-pointer
                  focus:bg-primary/10
                "
              >
                <div
                  className="
                    flex size-7 items-center justify-center rounded-md
                    border bg-gradient-to-br from-primary/10 to-secondary/10
                    text-primary font-semibold
                  "
                >
                  {ed.number}
                </div>

                <span className="flex-1 truncate">
                  {ed.course.name}{" "}
                  <span className="text-muted-foreground">
                    ({ed.location.name})
                  </span>
                </span>

                <DropdownMenuShortcut className="text-muted-foreground">
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {user?.role === "ADMIN" ? (
              <DropdownMenuItem asChild className="p-0">
                <NewEditionSheet
                  trigger={
                    <div
                      className="
                        group flex items-center gap-2 px-3 py-2
                        rounded-lg cursor-pointer
                        hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
                        transition
                      "
                    >
                      <span
                        className="
                          flex size-8 items-center justify-center rounded-lg
                          text-primary-foreground
                          bg-gradient-to-br from-primary to-secondary
                          shadow-sm ring-1 ring-white/10
                        "
                      >
                        <Plus className="size-4" />
                      </span>

                      <span className="font-medium">Criar nova edição</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Admin
                      </span>
                    </div>
                  }
                />
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
