"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import { useAuth } from "@/contexts/auth-context";
import { CourseProps } from "@/app/types/course";
import { CourseTableActions } from "./actions";

export function useCourseColumns(): ColumnDef<CourseProps>[] {
  const t = useTranslations("Dashboard.CoursesPage.Table");
  const { user } = useAuth();

  return [
    {
      accessorKey: "name",
      header: t("CourseNameColumn"),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "modality",
      header: t("CourseModalityColumn"),
      cell: ({ row }) => (
        <span
          className="
            inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
            border border-primary/15
            bg-gradient-to-r from-primary/10 to-accent/10
          "
        >
          {t(`ModalitiesList.${row.original.modality}`)}
        </span>
      ),
    },
    {
      accessorKey: "editions",
      header: t("CourseEditionsColumn"),
      cell: ({ row }) => (
        <span
          className="
            inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
            border border-primary/15
            bg-gradient-to-r from-primary/10 to-accent/10
          "
        >
          {row.original.editions.length}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("CourseCreatedAtColumn"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(row.original.createdAt, "dd/MM/yyyy")}
        </span>
      ),
    },
    user?.role === "ADMIN"
      ? {
          id: "actions",
          header: () => (
            <span className="text-sm text-muted-foreground">Actions</span>
          ),
          cell: ({ row }) => <CourseTableActions course={row.original} />,
        }
      : { id: "actions", cell: () => null },
  ];
}
