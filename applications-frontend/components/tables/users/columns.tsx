"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Copy, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserProps } from "@/app/types/user";
import { useAuth } from "@/contexts/auth-context";
import { useTranslations } from "next-intl";

export function useUserColumns(): ColumnDef<UserProps>[] {
  const { user } = useAuth();
  const t = useTranslations("Dashboard.UsersPage");

  const isAdmin = user?.role === "ADMIN";

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="rounded-xl"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Table.NameColumn")}
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: t("Table.RoleColumn"),
      cell: ({ row }) => {
        const roleLabel = t(`Table.UserRoles.${row.original.role}`);
        return (
          <span
            className="
              inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
              border border-primary/15
              bg-gradient-to-r from-primary/10 to-accent/10
              text-foreground
            "
          >
            {roleLabel}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="text-muted-foreground text-sm">
          {t("Table.ActionsColumn")}
        </span>
      ),
      cell: ({ row }) => {
        const rowUser = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="
                  h-9 w-9 rounded-xl p-0
                  hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
                "
              >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
                min-w-52 rounded-xl border
                bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                shadow-xl
              "
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("Table.ActionsColumn")}
              </DropdownMenuLabel>

              <DropdownMenuItem
                className="
                  gap-2 rounded-lg cursor-pointer
                  focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                "
                onClick={() => navigator.clipboard.writeText(rowUser.id)}
              >
                <Copy className="size-4 text-primary" />
                {t("Table.CopyIDAction")}
              </DropdownMenuItem>

              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="
                      gap-2 rounded-lg cursor-pointer
                      text-destructive
                      focus:bg-destructive/10
                    "
                  >
                    <Trash2 className="size-4" />
                    {t("Table.DeleteAction")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
