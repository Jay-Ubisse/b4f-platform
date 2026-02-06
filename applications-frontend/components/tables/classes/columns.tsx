"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassProps } from "@/app/types/class";

export function useClassColumns(): ColumnDef<ClassProps>[] {
  const t = useTranslations("Dashboard.ClassesPage.Table");

  return [
    {
      accessorFn: (row) => row.edition.name,
      id: "edition",
      header: t("ClassEditionColumn"),
    },
    {
      accessorFn: (row) => row.edition.location?.name ?? "",
      id: "location",
      header: t("ClassLocationColumn"),
      cell: ({ row }) => (
        <span className="truncate block max-w-[240px]">
          {row.original.edition?.location?.name ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "shift",
      header: t("ClassShiftColumn"),
      cell: ({ row }) => t(`ClassShift.${row.original.shift}`),
    },
    {
      accessorKey: "capacity",
      header: t("ClassCapacityColumn"),
      cell: ({ row }) => (
        <span>
          {row.original.capacity} {t("Students")}
        </span>
      ),
    },
    {
      id: "studentsCount",
      header: t("ClassStudentsColumn"),
      cell: ({ row }) => (
        <span>
          {row.original.students.length} {t("Students")}
        </span>
      ),
    },
    {
      id: "Acções",
      cell: ({ row }) => {
        const class_ = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("Actions.OpenMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Actions.Label")}</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(class_.id)}
              >
                {t("Actions.CopyIDAction")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/classes/${class_.id}`}>
                  {t("Actions.ViewDetailsAction")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
