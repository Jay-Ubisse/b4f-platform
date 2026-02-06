"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

export function NavLinks({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Link
            href={item.url}
            key={item.title}
            className={` ${
              (user?.role === "STUDENT" || user?.role === "ALUMNI") &&
              (item.title === "Alunos" || item.title === "Cursos")
                ? "hidden"
                : "my-1"
            }`}
          >
            <SidebarMenuButton
              className={`${
                pathname.includes(item.url)
                  ? "bg-primary text-secondary"
                  : "bg-transparent"
              } hover:bg-primary hover:text-secondary`}
              tooltip={item.title}
            >
              {item.icon && <item.icon />}
              <span className="text-base font-normal">{item.title}</span>
            </SidebarMenuButton>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
