// overview/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { _Translator as Translator } from "next-intl";
import { Sparkles, RefreshCcw, BarChart3, Download, Sheet } from "lucide-react";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { getCandidatesByEdition } from "@/services/candidates";
import { GenderChart } from "@/components/charts/gender-chart";
import { StatusChart } from "@/components/charts/status-chart";
import { ApplicationsEvolutionChart } from "@/components/charts/applications-evolutions-chart";
import { OverviviewDataCard } from "@/components/cards/overview-data";

import { useEdition } from "@/contexts/edition-contentx";
import { EditionProps } from "@/app/types/edition";
import {
  CandidateProps,
  CandidateStatus,
  Gender,
} from "@/app/types/candidates";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OverviewPage() {
  const { edition } = useEdition();
  const t = useTranslations("Dashboard.OverviewPage");

  const {
    isPending,
    error,
    data: candidates,
    refetch,
  } = useQuery({
    queryKey: ["candidates", edition?.id],
    queryFn: () => getCandidatesByEdition({ editionId: edition?.id }),
    enabled: !!edition?.id,
    refetchInterval: 5000,
  });

  // ====== UI: Edição não selecionada ======
  if (!edition?.id) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <Breadcrumb className="hidden sm:block absolute top-[22px] left-14">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("BreadCrumbTitile")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-6xl mx-auto mt-10">
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
            <div className="flex items-start gap-3">
              <span
                className="
                  inline-flex size-10 shrink-0 items-center justify-center rounded-xl
                  bg-gradient-to-br from-primary to-secondary
                  text-primary-foreground ring-1 ring-white/10
                "
              >
                <BarChart3 className="size-5" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {t("NoEditionSelected")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("SelectEditionHint") ??
                    "Selecione uma edição no topo da sidebar para ver a visão geral."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== Loading ======
  if (isPending) {
    return (
      <div className="flex justify-center items-center px-4 py-2 w-full h-[320px]">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // ====== Erro / Sem dados ======
  if (error || !candidates) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <Breadcrumb className="hidden sm:block absolute top-[22px] left-14">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("BreadCrumbTitile")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-6xl mx-auto mt-10">
          <Header t={t} editionLabel={edition?.name} />

          <div className="mt-6 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground">{t("NoDataFound")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="rounded-xl"
              >
                <RefreshCcw className="size-4 mr-2" />
                {t("Refresh")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return filterCandidatesByEdition({
    edition,
    candidates,
    t,
  });
}

function filterCandidatesByEdition({
  edition,
  candidates,
  t,
}: {
  edition: EditionProps | null;
  candidates: CandidateProps[];
  t: Translator<Record<string, string>>;
}) {
  const editionCandidates = candidates.filter(
    (candidate) => candidate.editionId === edition?.id,
  );

  if (!editionCandidates || editionCandidates.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <Breadcrumb className="hidden sm:block absolute top-[22px] left-14">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("BreadCrumbTitile")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-6xl mx-auto mt-10">
          <Header t={t} editionLabel={edition?.name} />
          <div className="mt-6 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4">
            <p className="text-sm text-foreground">
              {t("NoDataFoundInEdition")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== Stats =====
  const femaleCandidates = editionCandidates.filter(
    (candidate) => candidate.gender === Gender.FEMALE,
  );

  const admittedCandidates = editionCandidates.filter(
    (candidate) => candidate.status === CandidateStatus.ADMITTED,
  );

  const notAdmittedCandidates = editionCandidates.filter(
    (candidate) => candidate.status === CandidateStatus.NOT_ADMITTED,
  );

  const femaleAdmittedCandidates = admittedCandidates.filter(
    (c) => c.gender === Gender.FEMALE,
  );

  const notInterviewedCandidates = editionCandidates.filter(
    (candidate) =>
      candidate.status === CandidateStatus.PENDING ||
      candidate.status === CandidateStatus.INTERVIEW_CONFIRMED ||
      candidate.status === CandidateStatus.INTERVIEW_SCHEDULED,
  );

  // ===== Evolução por período =====
  const candidatesByMonth = editionCandidates.reduce(
    (acc: Record<string, number>, candidate) => {
      const date = new Date(candidate.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );

  // ===== Distribuição territorial =====
  const candidatesByLocation = editionCandidates.reduce(
    (acc: Record<string, number>, candidate) => {
      const location = candidate.edition?.location;
      const name = location?.name ?? t("UnknownLocation");
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    },
    {},
  );

  // ===== Taxas (%) =====
  const admittedRate =
    editionCandidates.length > 0
      ? Math.round((admittedCandidates.length / editionCandidates.length) * 100)
      : 0;

  const notAdmittedRate = 100 - admittedRate;

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <Breadcrumb className="hidden sm:block absolute top-[22px] left-14">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("BreadCrumbTitile")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <Header t={t} editionLabel={edition?.name} />

          <div className="sm:mt-0">
            <ExportOverviewButton t={t} />
          </div>
        </div>

        <div className="mt-6">
          {/* CARDS */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <OverviviewDataCard
              amount={editionCandidates.length}
              label={t("TotalCandidates")}
            />
            <OverviviewDataCard
              amount={femaleCandidates.length}
              label={t("FemaleCandidates")}
            />
            <OverviviewDataCard
              amount={editionCandidates.length - femaleCandidates.length}
              label={t("MaleCandidates")}
            />
            <OverviviewDataCard
              amount={admittedCandidates.length}
              label={t("AdmittedCandidates")}
            />
            <OverviviewDataCard
              amount={femaleAdmittedCandidates.length}
              label={t("FemaleAdmittedCandidates")}
            />
            <OverviviewDataCard
              amount={
                admittedCandidates.length - femaleAdmittedCandidates.length
              }
              label={t("MaleAdmittedCandidates")}
            />
            <OverviviewDataCard
              amount={admittedCandidates.length + notAdmittedCandidates.length}
              label={t("InterviewedCandidates")}
            />
            <OverviviewDataCard
              amount={notInterviewedCandidates.length}
              label={t("NotInterviewedCandidates")}
            />
            <OverviviewDataCard
              amount={`${admittedRate}%`}
              label={t("AdmittedRate")}
            />
            <OverviviewDataCard
              amount={`${notAdmittedRate}%`}
              label={t("NotAdmittedRate")}
            />
          </div>

          {/* GRAFICOS */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="rounded-2xl border border-primary/15 bg-background p-4 min-h-[320px] overflow-x-auto"
              data-export-chart="true"
              data-export-name={t("CandidatesByGenderChartTitle")}
            >
              <h2 className="mb-2 font-semibold">
                {t("CandidatesByGenderChartTitle")}
              </h2>
              <GenderChart
                female={femaleCandidates.length}
                male={editionCandidates.length - femaleCandidates.length}
              />
            </div>

            <div
              className="rounded-2xl border border-primary/15 bg-background p-4 min-h-[320px] overflow-x-auto"
              data-export-chart="true"
              data-export-name={t("CandidatesByStatusChartTitle")}
            >
              <h2 className="mb-2 font-semibold">
                {t("CandidatesByStatusChartTitle")}
              </h2>
              <StatusChart
                admitted={admittedCandidates.length}
                notAdmitted={notAdmittedCandidates.length}
                notInterviewed={notInterviewedCandidates.length}
              />
            </div>

            <div
              className="rounded-2xl border border-primary/15 bg-background p-4 min-h-[320px] overflow-x-auto"
              data-export-chart="true"
              data-export-name={t("AdmittedCandidatesByGenderChartTitle")}
            >
              <h2 className="mb-2 font-semibold">
                {t("AdmittedCandidatesByGenderChartTitle")}
              </h2>
              <GenderChart
                female={femaleAdmittedCandidates.length}
                male={
                  admittedCandidates.length - femaleAdmittedCandidates.length
                }
              />
            </div>

            <div
              className="rounded-2xl border border-primary/15 bg-background p-4 min-h-[320px] overflow-x-auto"
              data-export-chart="true"
              data-export-name={t("ApplicationsEvolutionChartTitle")}
            >
              <h2 className="mb-2 font-semibold">
                {t("ApplicationsEvolutionChartTitle")}
              </h2>

              <div className="w-full overflow-x-auto">
                <ApplicationsEvolutionChart
                  data={Object.entries(candidatesByMonth).map(
                    ([key, value]) => ({
                      period: key,
                      total: value,
                    }),
                  )}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-background p-4 min-h-[320px] lg:col-span-2">
              <h2 className="mb-4 text-base font-semibold">
                {t("CandidatesTerritorialDistribution.Title")}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-left font-medium">
                        {t("CandidatesTerritorialDistribution.Table.Location")}
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        {t("CandidatesTerritorialDistribution.Table.Total")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(candidatesByLocation).map(
                      ([location, total]) => (
                        <tr key={location} className="border-b last:border-b-0">
                          <td className="px-3 py-2">{location}</td>
                          <td className="px-3 py-2 text-right font-medium">
                            {total}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>

                  <tfoot>
                    <tr className="border-t bg-muted/40">
                      <td className="px-3 py-2 font-semibold">
                        {t(
                          "CandidatesTerritorialDistribution.Table.GrandTotal",
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {Object.values(candidatesByLocation).reduce(
                          (acc, value) => acc + value,
                          0,
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Header({
  t,
  editionLabel,
}: {
  t: ReturnType<typeof useTranslations>;
  editionLabel?: string;
}) {
  return (
    <div className="w-full rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-accent" />
            {editionLabel ? `${editionLabel}` : t("BreadCrumbTitile")}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {t("BreadCrumbTitile")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("Subtitle") ??
              "Acompanhe métricas e tendências das candidaturas na edição seleccionada."}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExportOverviewButton({ t }: { t: Translator }) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleExcelExport() {
    console.log("exported");
    setIsLoading(true);
    console.log("Exporting...");
    setIsLoading(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-xl hover:bg-accent hover:text-accent"
          variant="outline"
          disabled={isLoading}
        >
          <Download className="size-4 mr-2" />
          {isLoading ? t("ExportButton.Loading") : t("ExportButton.Label")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onClick={() => handleExcelExport()}
          disabled={isLoading}
        >
          <Sheet className="size-4 mr-2" />
          Excel (.xlsx)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
