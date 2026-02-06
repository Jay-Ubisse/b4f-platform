"use client";

import { MoreHorizontal, Trash, Edit, Info } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CountryProps } from "@/app/types/country";
import { deleteCountry } from "@/services/country";
import { EditCountrySheet } from "@/components/sheets/edit-country-sheet";

export function CountryTableActions({ country }: { country: CountryProps }) {
  const t = useTranslations("Dashboard.CountriesPage.Table.Actions");

  const [ConfirmDialog, confirm] = useConfirm(
    t("DialogTitle"),
    t("DialogDescription"),
  );

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      toast.loading(t("OnDeleteLoading"), { id: "1" });
      const response = await deleteCountry({ id: country.id });

      if (response?.status === 200) {
        toast.success(t("OnDeleteSuccess"), { id: "1" });
      } else {
        toast.error(t("OnDeleteError"), { id: "1" });
      }
    }
  };

  return (
    <>
      <ConfirmDialog />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="
              h-9 w-9 rounded-xl p-0
              hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
            "
          >
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="
            min-w-52 rounded-xl border
            bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
            shadow-xl
          "
        >
          <DropdownMenuItem asChild className="p-0">
            <EditCountrySheet
              country={country}
              trigger={
                <div
                  className="
                    flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                    hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
                    transition
                  "
                >
                  <Edit className="size-4 text-primary" />
                  <span className="text-sm">{t("EditAction")}</span>
                </div>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="
              gap-2 rounded-lg cursor-pointer
              text-destructive
              focus:bg-destructive/10
            "
            onClick={handleDelete}
          >
            <Trash className="size-4" />
            {t("DeleteAction")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="
              rounded-lg cursor-pointer
              focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
              p-0
            "
          >
            <Link
              href={`/dashboard/countries/${country.id}`}
              className="flex w-full items-center gap-2 px-3 py-2"
            >
              <Info className="size-4 text-primary" />
              <span className="text-sm">{t("ViewDetailsAction")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
