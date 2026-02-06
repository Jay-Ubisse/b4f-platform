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
import { Search, Filter } from "lucide-react";

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
import { EditionStatus } from "@/app/types/edition";

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

  const t = useTranslations("Dashboard.EditionsPage.Table");

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

  const applicationColumn = table.getColumn("applicationsStatus");
  const lessonColumn = table.getColumn("lessonsStatus");
  const courseColumn = table.getColumn("course");

  const resultsCount = table.getFilteredRowModel().rows.length;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center w-full">
          {/* course search */}
          <div className="relative w-full md:max-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("Filters.ByCourse")}
              value={(courseColumn?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                courseColumn?.setFilterValue(event.target.value)
              }
              className="
                h-10 w-full rounded-xl pl-9
                bg-card/60 border-border
                focus-visible:ring-2 focus-visible:ring-ring
              "
            />
          </div>

          {/* application status */}
          <Select
            value={(applicationColumn?.getFilterValue() as string) || undefined}
            onValueChange={(value) =>
              applicationColumn?.setFilterValue(value === "ALL" ? "" : value)
            }
          >
            <SelectTrigger
              className="
                h-10 w-full md:max-w-[260px] rounded-xl
                bg-card/60 border-border
                focus:ring-2 focus:ring-ring
                relative overflow-hidden
              "
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
              <span className="relative inline-flex items-center gap-2 min-w-0">
                <Filter className="size-4 shrink-0 text-muted-foreground" />
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
              <SelectItem value="ALL">
                {t("Filters.ByApplicationStatus.ALL")}
              </SelectItem>
              <SelectItem value={EditionStatus.OPEN}>
                {t("Filters.ByApplicationStatus.OPEN")}
              </SelectItem>
              <SelectItem value={EditionStatus.CLOSED}>
                {t("Filters.ByApplicationStatus.CLOSED")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* lessons status */}
          <Select
            value={(lessonColumn?.getFilterValue() as string) || undefined}
            onValueChange={(value) =>
              lessonColumn?.setFilterValue(value === "ALL" ? "" : value)
            }
          >
            <SelectTrigger
              className="
                h-10 w-full md:max-w-[260px] rounded-xl
                bg-card/60 border-border
                focus:ring-2 focus:ring-ring
                relative overflow-hidden
              "
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
              <span className="relative inline-flex items-center gap-2 min-w-0">
                <Filter className="size-4 shrink-0 text-muted-foreground" />
                <SelectValue
                  placeholder={t("Filters.ByLessonsStatus.Placeholder")}
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
              <SelectItem value="ALL">
                {t("Filters.ByLessonsStatus.ALL")}
              </SelectItem>
              <SelectItem value={EditionStatus.OPEN}>
                {t("Filters.ByLessonsStatus.OPEN")}
              </SelectItem>
              <SelectItem value={EditionStatus.CLOSED}>
                {t("Filters.ByLessonsStatus.CLOSED")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-muted-foreground">
          {resultsCount} {resultsCount === 1 ? "result" : "results"}
        </p>
      </div>

      {/* Table */}
      <div
        className="
          mt-3 overflow-hidden rounded-xl border border-border
          bg-background/60 supports-[backdrop-filter]:bg-background/50
          supports-[backdrop-filter]:backdrop-blur-xl
        "
      >
        <Table>
          <TableHeader className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground">
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
                  className="transition hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
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
                  className="h-28 text-center"
                >
                  <div className="mx-auto max-w-sm space-y-2">
                    <p className="text-sm font-medium">{t("NoDataFound")}</p>
                    <p className="text-xs text-muted-foreground">
                      Ajusta os filtros para encontrar uma edição.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </p>

        <div className="flex items-center gap-2">
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
            size="sm"
            className="
              rounded-xl
              bg-gradient-to-r from-primary to-secondary
              text-primary-foreground
              shadow-sm hover:shadow-md transition
            "
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
