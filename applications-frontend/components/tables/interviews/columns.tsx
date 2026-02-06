"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
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
import { InterviewProps } from "@/app/types/interview";
import { statusStyleGenerator } from "@/lib/status-style-generator";

export function useInterviewColumns(): ColumnDef<InterviewProps>[] {
  const t = useTranslations("Dashboard.InterviewsPage.Table");

  return [
    {
      id: "candidate",
      accessorFn: (row) => row.candidate.name,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("CandidateNameColumn")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/interviews/${row.original.id}`}
          className="block max-w-[220px] min-w-0 truncate hover:underline"
        >
          {row.original.candidate.name}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: t("ApplicationStatusColumn"),
      cell: ({ row }) => (
        <span className={statusStyleGenerator(row.original.status)}>
          {t(`InterviewStatus.${row.original.status}`)}
        </span>
      ),
    },
    {
      accessorKey: "result",
      header: t("InterviewResultColumn"),
      cell: ({ row }) => (
        <span className={statusStyleGenerator(row.original.candidate.status)}>
          {t(`InterviewResult.${row.original.result}`)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("InterviewDateColumn"),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {format(row.original.createdAt, "dd/MM/yyyy")}
        </span>
      ),
    },
    {
      id: "candidatePhone",
      accessorFn: (row) => row.candidate.phone,
      header: t("CandidatePhoneColumn"),
      cell: ({ row }) => (
        <span className="block max-w-[160px] min-w-0 truncate">
          {row.original.candidate.phone}
        </span>
      ),
    },
    {
      id: "candidateEmail",
      accessorFn: (row) => row.candidate.email,
      header: t("CandidateEmailColumn"),
      cell: ({ row }) => (
        <span className="block max-w-[220px] min-w-0 truncate">
          {row.original.candidate.email}
        </span>
      ),
    },
    {
      id: "Acções",
      cell: ({ row }) => {
        const interview = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(interview.id)}
              >
                {t("CopyIDAction")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/interviews/${interview.id}`}>
                  {t("ViewInterviewDetailsAction")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
