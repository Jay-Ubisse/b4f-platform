// candidates/[id]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { RefreshCcw } from "lucide-react";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { getCandidate } from "@/services/candidates";
import CandidateDetailsCard from "@/components/cards/candidate-details";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CadidateDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getCandidate", id],
    queryFn: () => getCandidate({ id }),
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
                Ocorreu um erro ao carregar candidato
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch as unknown as () => void}
                className="rounded-xl"
              >
                <RefreshCcw className="size-4 mr-2" />
                Recarregar
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
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground">
                Candidato não encontrado
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch as unknown as () => void}
                className="rounded-xl"
              >
                <RefreshCcw className="size-4 mr-2" />
                Recarregar
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
            <BreadcrumbLink href="/dashboard/candidates">
              Candidatos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[260px] truncate">
              {data.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-6xl mx-auto mt-10">
        <CandidateDetailsCard candidate={data} />
      </div>
    </div>
  );
}
