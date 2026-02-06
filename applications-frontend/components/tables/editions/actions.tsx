"use client";

import { MoreHorizontal, Trash, Edit } from "lucide-react";
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
import { deleteEdition } from "@/services/editions";
import { EditEditionSheet } from "@/components/sheets/edit-edition-sheet";
import { EditionProps } from "@/app/types/edition";

export function Actions({ edition }: { edition: EditionProps }) {
  const t = useTranslations("Dashboard.EditionsPage.Table.Actions");

  const [ConfirmDialog, confirm] = useConfirm(
    t("DialogTitle"),
    t("DialogDescription"),
  );

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      toast.loading(t("OnDeleteLoading") ?? "A eliminar edição...", {
        id: "1",
      });
      const response = await deleteEdition(edition.id);

      if (response.status === 200) {
        toast.success(t("OnDeleteSuccess") ?? "Edição eliminada com sucesso", {
          id: "1",
        });
      } else {
        toast.error(
          response?.response?.data?.message ??
            t("OnDeleteError") ??
            "Erro ao eliminar",
          { id: "1" },
        );
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
            <EditEditionSheet
              edition={edition}
              trigger={
                <div
                  className="
                    flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                    hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
                    transition
                  "
                >
                  <Edit className="size-4 text-primary shrink-0" />
                  <span className="text-sm">{t("EditAction")}</span>
                </div>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="
              gap-2 rounded-lg cursor-pointer
              text-destructive focus:bg-destructive/10
            "
            onClick={handleDelete}
          >
            <Trash className="size-4 shrink-0" />
            {t("DeleteAction")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
