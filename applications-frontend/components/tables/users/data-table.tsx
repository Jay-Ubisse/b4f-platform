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

  const t = useTranslations("Dashboard.UsersPage.Table");

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

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("Filters.ByName")}
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="
                h-10 w-full md:w-[240px] rounded-xl pl-9
                bg-card/60 border-border
                focus-visible:ring-2 focus-visible:ring-ring
              "
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("Filters.ByRole")}
              value={
                (table.getColumn("role")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("role")?.setFilterValue(event.target.value)
              }
              className="
                h-10 w-full md:w-[200px] rounded-xl pl-9
                bg-card/60 border-border
                focus-visible:ring-2 focus-visible:ring-ring
              "
            />
          </div>
        </div>

        {/* Optional: quick info */}
        <div className="text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length}{" "}
          {t("NoDataFound") === "No data found" ? "results" : ""}
        </div>
      </div>

      {/* Table */}
      <div
        className="
          mt-4 overflow-hidden rounded-xl border border-border
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
                  className={cn(
                    "transition",
                    "hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5",
                  )}
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
                      Tente ajustar os filtros para encontrar o usuário.
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
              bg-gradient-to-r from-primary to-secondary text-primary-foreground
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
