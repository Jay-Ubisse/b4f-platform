"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { useAuth } from "@/contexts/auth-context";
import { CountryProps } from "@/app/types/country";
import { CountryTableActions } from "./actions";

export function useCountryColumns(): ColumnDef<CountryProps>[] {
  const t = useTranslations("Dashboard.CountriesPage.Table");
  const { user } = useAuth();

  return [
    {
      accessorKey: "name",
      header: t("CountryNameColumn"),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "locations",
      header: t("CountryLocationColumn"),
      cell: ({ row }) => (
        <span
          className="
            inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
            border border-primary/15
            bg-gradient-to-r from-primary/10 to-accent/10
          "
        >
          {row.original.locations.length}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("CountryCreatedAtColumn"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(row.original.createdAt, "dd/MM/yyyy")}
        </span>
      ),
    },
    user && user.role === "ADMIN"
      ? {
          id: "actions",
          header: () => (
            <span className="text-sm text-muted-foreground">Actions</span>
          ),
          cell: ({ row }) => <CountryTableActions country={row.original} />,
        }
      : { id: "actions", cell: () => null },
  ];
}
