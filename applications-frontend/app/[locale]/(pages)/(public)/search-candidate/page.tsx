// search-candidate/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw, Search, Sparkles, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Header } from "@/components/public-header";
import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCandidates } from "@/services/candidates";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { CandidateProps } from "@/app/types/candidates";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  code: z
    .string({ required_error: "Insira o código do candidato" })
    .min(1, "Insira o código do candidato"),
});

export default function SearchCandidate() {
  const t = useTranslations("Public.CandidateSearchPage");

  const [resultVisibility, setResultVisibility] = useState(false);
  const [candidate, setCandidate] = useState<CandidateProps | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const {
    isPending,
    error,
    data: candidates,
    refetch,
  } = useQuery({
    queryKey: ["candidates"],
    queryFn: () => getCandidates(),
    refetchInterval: 5000,
  });

  const normalizedCode = useMemo(() => {
    const v = form.watch("code");
    return (v ?? "").trim().toUpperCase();
  }, [form.watch("code")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResultVisibility(true);

    const code = values.code.trim().toUpperCase();
    const found = candidates?.find(
      (c) => (c.code ?? "").trim().toUpperCase() === code,
    );

    setCandidate(found ?? null);
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header / Hero */}
      <div className="h-28 sm:h-40 bg-[url(/home-background.jpg)] bg-cover bg-center">
        <div className="h-full w-full bg-gradient-to-tr from-purple-700/70 to-violet-700/70">
          <Header />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-2xl mx-auto mt-10">
          {/* Header Card (estilo moderno como dashboard) */}
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="size-4 text-accent" />
                  {t("Badge") ?? "Acompanhar candidatura"}
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">
                  {t("Title") ?? "Pesquisar candidato"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("Subtitle") ??
                    "Insira o código do candidato para ver o estado da candidatura."}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={refetch as unknown as () => void}
                className="rounded-xl"
              >
                <RefreshCcw className="size-4 mr-2" />
                {t("Refresh") ?? "Recarregar"}
              </Button>
            </div>
          </div>

          {/* Form + Result */}
          <Card className="mt-6 rounded-2xl border border-primary/15 p-5 sm:p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder={
                                t("InputPlaceholder") ?? "Ex.: B4F-2026-0001"
                              }
                              className="pl-9 rounded-xl"
                              onChange={(e) => {
                                // mantém UX: vai normalizando sem “brigar” com o user
                                field.onChange(e.target.value);
                                if (resultVisibility)
                                  setResultVisibility(false);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full sm:w-auto rounded-xl"
                    disabled={!normalizedCode}
                  >
                    <Search className="size-4 mr-2" />
                    {t("SearchButton") ?? "Pesquisar"}
                  </Button>
                </div>

                {/* Estados da query (compactos, mesmo estilo moderno) */}
                {isPending && (
                  <div className="flex justify-center items-center h-20">
                    <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-foreground">
                        {t("Error") ?? "Ocorreu um erro ao carregar dados."}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={refetch as unknown as () => void}
                        className="rounded-xl"
                      >
                        <RefreshCcw className="size-4 mr-2" />
                        {t("Refresh") ?? "Recarregar"}
                      </Button>
                    </div>
                  </div>
                )}

                {candidates && candidates.length === 0 && (
                  <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4">
                    <p className="text-sm text-foreground">
                      {t("NoCandidatesFound") ??
                        "Nenhum candidato encontrado no momento."}
                    </p>
                  </div>
                )}

                {/* Resultado */}
                <div
                  className={cn("pt-1", resultVisibility ? "block" : "hidden")}
                >
                  {candidate ? (
                    <Link
                      href={`/candidate/${candidate.id}`}
                      className="
                        group block rounded-2xl border border-primary/15 bg-background
                        hover:bg-muted/40 transition p-4
                      "
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-muted-foreground">
                            {t("ResultLabel") ?? "Candidato encontrado"}
                          </p>
                          <h2 className="font-semibold truncate">
                            {candidate.name}
                          </h2>
                          <p className="text-sm truncate text-muted-foreground">
                            {candidate.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-primary">
                          <span className="hidden sm:inline">
                            {t("ViewDetails") ?? "Ver detalhes"}
                          </span>
                          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
                      <p className="text-sm text-foreground text-center">
                        {t("CandidateNotFound") ?? "Candidato não encontrado."}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </Card>

          {/* Dica/Nota */}
          <p className="mt-4 text-xs text-muted-foreground text-center">
            {t("Tip") ??
              "Dica: cole o código exatamente como recebido (sem espaços)."}
          </p>
        </div>
      </div>
    </div>
  );
}
