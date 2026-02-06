"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/services/auth";
import { useTranslations } from "next-intl";

export function NavUser({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const { isMobile } = useSidebar();
  const t = useTranslations("Dashboard.UserDialog");

  const initials =
    user.name.split(" ").length > 1
      ? user.name.split(" ")[0].charAt(0) + user.name.split(" ")[1].charAt(0)
      : user.name.split(" ")[0].charAt(0);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 data-[state=open]:opacity-100 transition" />

              <Avatar className="relative h-9 w-9 rounded-xl">
                <AvatarFallback
                  className="
                    rounded-xl text-primary-foreground font-semibold
                    bg-gradient-to-br from-primary to-secondary
                    ring-1 ring-white/10
                  "
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="relative grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>

              <ChevronsUpDown className="relative ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="
              w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl border
              bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl
              shadow-xl
            "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left">
                <Avatar className="h-9 w-9 rounded-xl">
                  <AvatarFallback
                    className="
                      rounded-xl text-primary-foreground font-semibold
                      bg-gradient-to-br from-primary to-secondary
                      ring-1 ring-white/10
                    "
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <span
                  className="
                    text-[10px] px-2 py-1 rounded-full
                    bg-gradient-to-r from-primary/15 to-accent/15
                    border border-primary/15 text-muted-foreground
                  "
                >
                  {user.role}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="
                  gap-2 rounded-lg cursor-pointer
                  focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                "
              >
                <BadgeCheck className="size-4 text-primary" />
                <span>{t("ProfileLink")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => logout()}
              className="
                gap-2 rounded-lg cursor-pointer
                focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
              "
            >
              <LogOut className="size-4 text-primary" />
              <span>{t("SignOutLink")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
