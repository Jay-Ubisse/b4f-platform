"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { RefreshCcw, Sparkles, MessageSquareWarning } from "lucide-react";
import { useTranslations } from "next-intl";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import InterviewDetailsCard from "@/components/cards/interview-details";
import { getInterview } from "@/services/interviews";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function InterviewDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("Dashboard.InterviewDetailsPage");

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterview({ id }),
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
        <Breadcrumb className="hidden md:block absolute top-[22px] left-14">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/interviews">
                Entrevistas
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detalhes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-6xl mx-auto mt-10">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground ring-1 ring-white/10">
                  <MessageSquareWarning className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {t("ErrorTitle") ?? "Erro ao carregar entrevista"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("ErrorDescription") ??
                      "Não foi possível carregar os dados. Tente novamente."}
                  </p>
                </div>
              </div>

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
        <Breadcrumb className="hidden md:block absolute top-[22px] left-14">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/interviews">
                Entrevistas
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detalhes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-6xl mx-auto mt-10">
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground ring-1 ring-white/10">
                  <Sparkles className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {t("NotFoundTitle") ?? "Entrevista não encontrada"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("NotFoundDescription") ??
                      "Pode ter sido removida ou o ID está incorrecto."}
                  </p>
                </div>
              </div>

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

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <Breadcrumb className="hidden md:block absolute top-[22px] left-14">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/interviews">
              Entrevistas
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[280px] truncate">
              {data.candidate.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-6xl mx-auto mt-10">
        <InterviewDetailsCard interview={data} />
      </div>
    </div>
  );
}
