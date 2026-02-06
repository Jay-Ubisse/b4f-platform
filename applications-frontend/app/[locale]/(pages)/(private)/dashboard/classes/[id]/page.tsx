"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { RefreshCcw, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { getClass } from "@/services/classes";
import { useEdition } from "@/contexts/edition-contentx";
import { ClassDetailsCard } from "@/components/cards/class-details";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { classShiftGenerator } from "@/lib/text-generator";

export default function ClassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { edition } = useEdition();
  const t = useTranslations("Dashboard.ClassDetailsPage");

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["class", id],
    queryFn: () => getClass({ id }),
    enabled: !!id,
    refetchInterval: 5000,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center px-4 py-2 w-full h-[420px]">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-6xl mx-auto mt-10">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground">
                {t("LoadError") ?? "Ocorreu um erro ao carregar turma"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="rounded-xl"
              >
                <RefreshCcw className="size-4 mr-2" />
                {t("Refresh") ?? "Recarregar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-6xl mx-auto mt-10">
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground ring-1 ring-white/10">
                <UsersRound className="size-5" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {t("NotFoundTitle") ?? "Turma não encontrada"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("NotFoundDescription") ??
                    "Verifique se o ID está correcto ou tente novamente."}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="rounded-xl mt-4"
                >
                  <RefreshCcw className="size-4 mr-2" />
                  {t("Refresh") ?? "Recarregar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (edition?.id && data.editionId !== edition.id) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-6xl mx-auto mt-10">
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground ring-1 ring-white/10">
                <UsersRound className="size-5" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {t("NotInEditionTitle") ??
                    "Turma não encontrada nesta edição"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("NotInEditionDescription") ??
                    "A turma existe, mas pertence a outra edição."}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="rounded-xl mt-4"
                >
                  <RefreshCcw className="size-4 mr-2" />
                  {t("Refresh") ?? "Recarregar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const breadLabel = `${classShiftGenerator(data.shift)} (${data.edition.location.name})`;

  return (
    <div>
      <Breadcrumb className="hidden md:block absolute top-[22px] left-14">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/classes">Turmas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ClassDetailsCard class_={data} />
    </div>
  );
}
