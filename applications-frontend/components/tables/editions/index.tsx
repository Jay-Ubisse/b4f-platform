"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { CalendarDays, RefreshCcw } from "lucide-react";
import { _Translator as Translator } from "next-intl";

import { getEditions } from "@/services/editions";
import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { useEditionColumns } from "./columns";
import { Card } from "@/components/ui/card";

export const EditionsTable = () => {
  const columns = useEditionColumns();
  const t = useTranslations("Dashboard.EditionsPage");

  const {
    isPending,
    error,
    data: editions,
    refetch,
  } = useQuery({
    queryKey: ["editions"],
    queryFn: () => getEditions(),
    refetchInterval: 5000,
  });

  return (
    <div className="mt-8">
      <Header t={t} count={editions?.length ?? 0} />

      {isPending ? (
        <StateCard variant="loading" title={t("Loading") ?? "Loading"}>
          <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
        </StateCard>
      ) : error ? (
        <StateCard
          variant="error"
          title={t("Error")}
          action={
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => refetch()}
            >
              <RefreshCcw className="size-4" />
              {t("Refresh")}
            </Button>
          }
        />
      ) : !editions || editions.length === 0 ? (
        <StateCard
          variant="empty"
          title={t("NoEditionsFound")}
          action={
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => refetch()}
            >
              <RefreshCcw className="size-4" />
              {t("Refresh")}
            </Button>
          }
        />
      ) : (
        <div className="mt-6">
          <Card
            className="
              overflow-hidden border-border
              bg-background/70 supports-[backdrop-filter]:bg-background/55
              supports-[backdrop-filter]:backdrop-blur-xl
              shadow-xl
            "
          >
            <div className="p-4 md:p-6">
              <DataTable columns={columns} data={editions} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

function Header({ t, count }: { t: Translator; count: number }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-accent" />
          {t("Header.Badge")}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="
              inline-flex size-10 items-center justify-center rounded-xl
              bg-gradient-to-br from-primary to-secondary
              text-primary-foreground shadow-sm ring-1 ring-white/10
            "
          >
            <CalendarDays className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("BreadCrumbTitile")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {count} {count === 1 ? t("Header.Edition") : t("Header.Editions")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/20 via-border to-accent/20 sm:col-span-2" />
    </div>
  );
}

function StateCard({
  variant,
  title,
  action,
  children,
}: {
  variant: "loading" | "error" | "empty";
  title: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const styles =
    variant === "error"
      ? "from-destructive/15 to-destructive/5"
      : variant === "empty"
        ? "from-accent/15 to-primary/10"
        : "from-primary/15 to-accent/10";

  return (
    <Card
      className="
        mt-8 overflow-hidden border-border
        bg-background/70 supports-[backdrop-filter]:bg-background/55
        supports-[backdrop-filter]:backdrop-blur-xl
        shadow-xl
      "
    >
      <div className={`p-6 md:p-8 bg-gradient-to-r ${styles}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-base font-semibold">{title}</p>
          <div className="flex items-center gap-3">
            {action}
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
