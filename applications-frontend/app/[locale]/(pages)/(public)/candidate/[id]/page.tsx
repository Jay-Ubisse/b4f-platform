"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { getCandidate } from "@/services/candidates";
import CandidateDetailsCard from "@/components/cards/candidate-details";
import { Header } from "@/components/public-header";
import { useTranslations } from "next-intl";

export default function CadidateDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("Public.CandidateDetailsPage");

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => getCandidate({ id }),
    refetchInterval: 5000,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-screen h-screen px-4">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-screen px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-xl bg-red-500/80 sm:bg-yellow-500/80 px-4 py-4 rounded-md gap-2 mt-20">
          <p className="text-center">{t("CandidateNotFound")}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch as unknown as () => void}
          >
            {t("Refresh")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-24 sm:h-32 bg-[url(/home-background.jpg)] bg-cover">
        <div className="h-full w-full bg-primary/60">
          <Header />
        </div>
      </div>
      <div className="px-4 py-6 sm:py-10">
        <CandidateDetailsCard candidate={data} />
      </div>
    </div>
  );
}
