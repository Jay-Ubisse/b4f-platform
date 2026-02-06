// tables/candidates/data-table.tsx
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
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { CandidateStatus } from "@/app/types/candidates";
import { cn } from "@/lib/utils";

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

  const t = useTranslations("Dashboard.CandidatesPage.Table");

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
    state: { sorting, columnFilters, columnVisibility },
  });

  const nameColumn = table.getColumn("name");
  const statusColumn = table.getColumn("status");

  return (
    <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("Filters.ByCandidate")}
              value={(nameColumn?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                nameColumn?.setFilterValue(event.target.value)
              }
              className="h-11 w-full md:w-[260px] rounded-xl pl-9 bg-background/60"
            />
          </div>

          <Select
            value={(statusColumn?.getFilterValue() as string) || undefined}
            onValueChange={(value) =>
              statusColumn?.setFilterValue(value === "ALL" ? "" : value)
            }
          >
            <SelectTrigger className="h-11 w-full md:w-[260px] rounded-xl bg-background/60">
              <span className="inline-flex items-center gap-2 min-w-0">
                <span
                  className="
                    inline-flex size-7 shrink-0 items-center justify-center rounded-lg
                    bg-gradient-to-br from-primary to-secondary
                    text-primary-foreground ring-1 ring-white/10
                  "
                >
                  <SlidersHorizontal className="size-4 text-primary-foreground" />
                </span>
                <SelectValue
                  placeholder={t("Filters.ByApplicationStatus.Placeholder")}
                />
              </span>
            </SelectTrigger>

            <SelectContent
              className="
                rounded-xl border border-border
                bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                shadow-xl
              "
            >
              <SelectItem value="ALL" className="rounded-lg">
                {t("Filters.ByApplicationStatus.ALL")}
              </SelectItem>
              <SelectItem
                value={CandidateStatus.PENDING}
                className="rounded-lg"
              >
                {t("Filters.ByApplicationStatus.PENDING")}
              </SelectItem>
              <SelectItem
                value={CandidateStatus.INTERVIEW_SCHEDULED}
                className="rounded-lg"
              >
                {t("Filters.ByApplicationStatus.INTERVIEW_SCHEDULED")}
              </SelectItem>
              <SelectItem
                value={CandidateStatus.ADMITTED}
                className="rounded-lg"
              >
                {t("Filters.ByApplicationStatus.ADMITTED")}
              </SelectItem>
              <SelectItem
                value={CandidateStatus.NOT_ADMITTED}
                className="rounded-lg"
              >
                {t("Filters.ByApplicationStatus.NOT_ADMITTED")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background/60">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gradient-to-r from-primary/10 to-accent/10"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-foreground">
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
                  className={cn("hover:bg-primary/5")}
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
                  className="h-28 text-center text-muted-foreground"
                >
                  {t("NoDataFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-end gap-2">
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
  );
}
