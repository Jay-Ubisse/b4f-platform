"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewResult, InterviewStatus } from "@/app/types/interview";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const t = useTranslations("Dashboard.InterviewsPage.Table");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const candidateColumn = table.getColumn("candidate");
  const statusColumn = table.getColumn("status");
  const resultColumn = table.getColumn("result");

  return (
    <div className="space-y-3">
      {/* FILTER BAR */}
      <div className="rounded-2xl border border-primary/15 bg-background/60 p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* Candidate filter */}
            <div className="relative md:w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Filters.ByCandidate") ?? "Filtrar nome..."}
                value={(candidateColumn?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  candidateColumn?.setFilterValue(event.target.value)
                }
                className="pl-9 rounded-xl"
              />
            </div>

            {/* Status filter */}
            <Select
              value={(statusColumn?.getFilterValue() as string) || undefined}
              onValueChange={(value) =>
                statusColumn?.setFilterValue(value === "ALL" ? "" : value)
              }
            >
              <SelectTrigger className="w-full md:w-[220px] rounded-xl">
                <SelectValue
                  placeholder={t("Filters.ByInterviewStatus.Placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  {t("Filters.ByInterviewStatus.ALL")}
                </SelectItem>
                <SelectItem value={InterviewStatus.SCHEDULED}>
                  {t("Filters.ByInterviewStatus.SCHEDULED")}
                </SelectItem>
                <SelectItem value={InterviewStatus.FINISHED}>
                  {t("Filters.ByInterviewStatus.FINISHED")}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Result filter */}
            <Select
              value={(resultColumn?.getFilterValue() as string) || undefined}
              onValueChange={(value) =>
                resultColumn?.setFilterValue(value === "ALL" ? "" : value)
              }
            >
              <SelectTrigger className="w-full md:w-[220px] rounded-xl">
                <SelectValue
                  placeholder={t("Filters.ByInterviewResult.Placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  {t("Filters.ByInterviewResult.ALL")}
                </SelectItem>
                <SelectItem value={InterviewResult.PENDING}>
                  {t("Filters.ByInterviewResult.PENDING")}
                </SelectItem>
                <SelectItem value={InterviewResult.ADMITTED}>
                  {t("Filters.ByInterviewResult.ADMITTED")}
                </SelectItem>
                <SelectItem value={InterviewResult.NOT_ADMITED}>
                  {t("Filters.ByInterviewResult.NOT_ADMITTED")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-primary/15 bg-background/60 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {t("NoDataFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* FOOTER / PAGINATION */}
        <div className="flex items-center justify-end gap-2 p-3 border-t border-primary/10">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("Navigation.Previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("Navigation.Next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
