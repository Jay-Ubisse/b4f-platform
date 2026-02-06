// tables/candidates/columns.tsx
"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  Copy,
  ExternalLink,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CandidateProps } from "@/app/types/candidates";
import { format } from "date-fns";
import { statusStyleGenerator } from "@/lib/status-style-generator";
import { candidateStatusGenerator } from "@/lib/text-generator";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function CellIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex size-8 shrink-0 items-center justify-center rounded-lg
        bg-gradient-to-br from-primary to-secondary
        text-primary-foreground ring-1 ring-white/10
      "
    >
      {children}
    </span>
  );
}

export function useCandidatesColumns(): ColumnDef<CandidateProps>[] {
  const t = useTranslations("Dashboard.CandidatesPage.Table");

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="rounded-xl"
        >
          {t("NameColumn")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/candidates/${row.original.id}`}
          className="flex items-center gap-2 min-w-0 hover:underline"
        >
          <CellIcon>
            <UserRound className="size-4" />
          </CellIcon>
          <span className="truncate font-medium">{row.original.name}</span>
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: t("EmailColumn"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-0">
          <CellIcon>
            <Mail className="size-4" />
          </CellIcon>
          <span className="truncate">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("PhoneColumn"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-0">
          <CellIcon>
            <Phone className="size-4" />
          </CellIcon>
          <span className="truncate">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("ApplicationStatusColumn"),
      cell: ({ row }) => (
        <span
          className={cn(
            statusStyleGenerator(row.original.status),
            "rounded-full px-3 py-1 text-xs font-medium",
          )}
        >
          {candidateStatusGenerator(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("ApplicationDateColumn"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-0">
          <CellIcon>
            <CalendarDays className="size-4" />
          </CellIcon>
          <span className="truncate">
            {format(row.original.createdAt, "dd/MM/yyyy")}
          </span>
        </div>
      ),
    },
    {
      id: "Acções",
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
                rounded-xl border border-border
                bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                shadow-xl
              "
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("Actions")}
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(candidate.id)}
                className="rounded-lg cursor-pointer"
              >
                <Copy className="size-4 mr-2" />
                {t("CopyIDAction")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link
                  href={`/dashboard/candidates/${candidate.id}`}
                  className="flex items-center"
                >
                  <ExternalLink className="size-4 mr-2" />
                  {t("ViewCandidateDetailsAction")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
