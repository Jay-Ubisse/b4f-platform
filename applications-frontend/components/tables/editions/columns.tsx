"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { EditionStatus, EditionProps } from "@/app/types/edition";
import { Actions } from "./actions";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/auth-context";

function StatusPill({ value, label }: { value: EditionStatus; label: string }) {
  const isOpen = value === EditionStatus.OPEN;

  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
        border
        ${
          isOpen
            ? "border-accent/20 bg-gradient-to-r from-accent/20 to-accent/10 text-foreground"
            : "border-destructive/20 bg-gradient-to-r from-destructive/15 to-destructive/5 text-foreground"
        }
      `}
    >
      <span
        className={`size-2 rounded-full ${isOpen ? "bg-accent" : "bg-destructive"}`}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function useEditionColumns(): ColumnDef<EditionProps>[] {
  const t = useTranslations("Dashboard.EditionsPage.Table");
  const { user } = useAuth();

  return [
    {
      accessorKey: "number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="rounded-xl"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("EditionNumberColumn")}
          <ArrowUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className="
            inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
            border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10
          "
        >
          #{row.original.number}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: t("EditionNameColumn"),
      cell: ({ row }) => (
        <span className="font-medium truncate block max-w-[260px]">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "course",
      accessorFn: (row) => row.course.name,
      header: t("EditionCourseColumn"),
      cell: ({ row }) => (
        <span className="truncate block max-w-[240px]">
          {row.original.course.name}
        </span>
      ),
    },
    {
      accessorKey: "year",
      header: t("EditionYearColumn"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.year}
        </span>
      ),
    },
    {
      accessorKey: "country",
      header: t("EditionCountryColumn"),
      cell: ({ row }) => (
        <span className="truncate block max-w-[180px]">
          {row.original.country.name}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: t("LocationColumn"),
      cell: ({ row }) => (
        <span className="truncate block max-w-[200px]">
          {row.original.location.name}
        </span>
      ),
    },
    {
      accessorKey: "applicationsStatus",
      header: t("ApplicationsStatusColumn"),
      cell: ({ row }) => (
        <StatusPill
          value={row.original.applicationsStatus}
          label={t(`ApplicationsStatus.${row.original.applicationsStatus}`)}
        />
      ),
    },
    {
      accessorKey: "lessonsStatus",
      header: t("LessonsStatusColumn"),
      cell: ({ row }) => (
        <StatusPill
          value={row.original.lessonsStatus}
          label={t(`LessonsStatus.${row.original.lessonsStatus}`)}
        />
      ),
    },
    user?.role === "ADMIN"
      ? {
          id: "actions",
          header: () => (
            <span className="text-sm text-muted-foreground">Actions</span>
          ),
          cell: ({ row }) => <Actions edition={row.original} />,
        }
      : { id: "actions", cell: () => null },
  ];
}
