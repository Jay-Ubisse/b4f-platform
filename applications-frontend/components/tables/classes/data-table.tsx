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

  const t = useTranslations("Dashboard.ClassesPage.Table");

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

  const editionColumn = table.getColumn("edition");
  const shiftColumn = table.getColumn("shift");

  return (
    <div>
      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center py-4">
        <Input
          placeholder={t("Filters.ByEdition")}
          value={(editionColumn?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            editionColumn?.setFilterValue(event.target.value)
          }
          className="md:max-w-60"
        />

        <Select
          value={(shiftColumn?.getFilterValue() as string) || undefined}
          onValueChange={(value) =>
            shiftColumn?.setFilterValue(value === "ALL" ? "" : value)
          }
        >
          <SelectTrigger className="w-full md:max-w-60">
            <SelectValue placeholder={t("Filters.ByShift.Placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("Filters.ByShift.ALL")}</SelectItem>
            {/* Ajusta os valores conforme o teu enum real */}
            <SelectItem value="MORNING">
              {t("Filters.ByShift.MORNING")}
            </SelectItem>
            <SelectItem value="AFTERNOON">
              {t("Filters.ByShift.AFTERNOON")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-primary/15 bg-background/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
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
                  className="hover:bg-muted/20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
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
                  className="h-24 text-center"
                >
                  {t("NoDataFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-xl"
        >
          {t("Navigation.Previous")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-xl"
        >
          {t("Navigation.Next")}
        </Button>
      </div>
    </div>
  );
}
