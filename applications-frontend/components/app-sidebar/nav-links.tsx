"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavLinks({
  items,
}: {
  items: { title: string; url: string; icon?: LucideIcon }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-1">
      <SidebarMenu>
        {items.map((item) => {
          const active = pathname.includes(item.url);

          return (
            <Link href={item.url} key={item.title} className="my-1 block">
              <SidebarMenuButton
                tooltip={item.title}
                className={[
                  "group relative overflow-hidden rounded-xl",
                  "group-hover:scale-[1.03] transition-transform",
                  "transition shadow-sm",
                  "hover:shadow-md hover:border-primary/20",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "text-primary-foreground border border-primary/20 shadow-md"
                    : "text-foreground border border-transparent",
                ].join(" ")}
              >
                {/* Background layer */}
                <div
                  className={[
                    "pointer-events-none absolute inset-0 transition",
                    active
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : "bg-gradient-to-r from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10",
                  ].join(" ")}
                />

                {/* Left glow accent */}
                <div
                  className={[
                    "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full transition",
                    active
                      ? "bg-accent opacity-90"
                      : "bg-accent opacity-0 group-hover:opacity-60",
                  ].join(" ")}
                />

                <span
                  className={[
                    "relative flex items-center justify-center",
                    "size-9 rounded-lg",
                    active
                      ? "bg-white/10 text-primary-foreground"
                      : "bg-transparent text-muted-foreground group-hover:text-foreground",
                  ].join(" ")}
                >
                  {item.icon && <item.icon className="size-5" />}
                </span>

                <span
                  className={[
                    "relative text-sm font-medium",
                    active ? "text-primary-foreground" : "text-foreground",
                  ].join(" ")}
                >
                  {item.title}
                </span>
              </SidebarMenuButton>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
