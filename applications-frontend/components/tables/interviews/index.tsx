"use client";

import { useQuery } from "@tanstack/react-query";
import { Copy, RefreshCcw, Sparkles, UsersRound } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { useInterviewColumns } from "./columns";
import { getInterviewsByEdition } from "@/services/interviews";
import { useEdition } from "@/contexts/edition-contentx";
import { InterviewBookingDialog } from "@/components/dialogs/interview-booking";

export const InterviewsTable = () => {
  const { edition } = useEdition();
  const t = useTranslations("Dashboard.InterviewsPage");
  const columns = useInterviewColumns();

  const {
    isPending,
    error,
    data: interviews,
    refetch,
  } = useQuery({
    queryKey: ["interviews", edition?.id],
    queryFn: () => getInterviewsByEdition({ editionId: edition?.id }),
    enabled: !!edition?.id,
    refetchInterval: 5000,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(edition?.interviewBookingUrl || "");
    toast.success(t("Copied") ?? "Copiado", { id: "copy" });
  };

  if (!edition?.id) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
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
                <UsersRound className="size-5" />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {t("NoEditionSelected")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("NoEditionSelectedHint")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <Header t={t} editionLabel={edition?.name} />

          <BookingLink
            t={t}
            url={edition?.interviewBookingUrl}
            editionId={edition.id}
            onCopy={handleCopy}
          />

          <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground">{t("Error")}</p>
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

  if (!interviews || interviews.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-6xl mx-auto mt-10">
          <Header t={t} editionLabel={edition?.name} />

          <BookingLink
            t={t}
            url={edition?.interviewBookingUrl}
            editionId={edition.id}
            onCopy={handleCopy}
          />

          <div className="mt-6 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground">
                {t("NoInterviewsFound")}
              </p>
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

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <div className="max-w-6xl mx-auto mt-10">
        <Header t={t} editionLabel={edition?.name} />

        <BookingLink
          t={t}
          url={edition?.interviewBookingUrl}
          editionId={edition.id}
          onCopy={handleCopy}
        />

        <div className="mt-6">
          <DataTable columns={columns} data={interviews} />
        </div>
      </div>
    </div>
  );
};

function Header({
  t,
  editionLabel,
}: {
  t: ReturnType<typeof useTranslations>;
  editionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-accent" />
            {editionLabel ? `${editionLabel}` : t("PageTitle")}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {t("PageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("Subtitle")}</p>
        </div>
      </div>
    </div>
  );
}

function BookingLink({
  t,
  url,
  editionId,
  onCopy,
}: {
  t: ReturnType<typeof useTranslations>;
  url?: string;
  editionId: string;
  onCopy: () => void;
}) {
  if (!url) {
    return (
      <div className="mt-4 w-fit">
        <InterviewBookingDialog
          interviewBookingUrl={url}
          editionId={editionId}
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm text-center">{t("InterviewBookinkLink")}</p>

      <div className="flex items-center justify-between rounded-2xl border border-primary/15 bg-background/60 px-4 py-3 max-w-xl mx-auto">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-blue-600 hover:underline min-w-0"
        >
          {url}
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            title={t("CopyLink") ?? "Copiar link"}
          >
            <Copy className="h-4 w-4" />
          </Button>

          <InterviewBookingDialog
            interviewBookingUrl={url}
            editionId={editionId}
          />
        </div>
      </div>
    </div>
  );
}
