"use client";

import { use } from "react";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCountryById } from "@/services/country";
import { Icons } from "@/components/loading-spinner";
import { CountryDetailsCard } from "@/components/cards/country-details";

export default function CountryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    isLoading,
    data: country,
    error,
    refetch,
  } = useQuery({
    queryKey: ["country"],
    queryFn: () => getCountryById({ id }),
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-between items-center px-4 py-2 w-full h-72">
        <Icons.spinner className="h-6 w-6 ml-[45%] animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
          <p>Ocorreu um erro ao carregar país</p>
          <Button variant={"outline"} size={"sm"} onClick={() => refetch()}>
            Recarregar
          </Button>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="p-10">
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-yellow-500/80">
          <p>País não encontrado</p>
          <Button variant={"outline"} size={"sm"} onClick={() => refetch()}>
            Recarregar
          </Button>
        </div>
      </div>
    );
  }

  return <CountryDetailsCard country={country} />;
}
