"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, Sparkles, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClass } from "@/services/classes";
import { useEdition } from "@/contexts/edition-contentx";

const formSchema = z.object({
  capacity: z.coerce.number().int().positive(),
  shift: z.string().min(1),
});

export function CreateClassForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { edition } = useEdition();
  const t = useTranslations("Dashboard.CreateClassPage.Form");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      capacity: undefined,
      shift: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!edition?.id) {
      toast.error(t("NoEditionSelected") ?? "Seleccione uma edição primeiro.", {
        id: "1",
      });
      return;
    }

    try {
      setIsLoading(true);
      toast.loading(t("OnSubmitLoading"), { id: "1" });

      const response = await createClass({
        data: {
          editionId: edition.id,
          capacity: values.capacity,
          shift: values.shift,
        },
      });

      if (response?.status === 201) {
        toast.success(t("OnSubmitSuccess"), { id: "1" });
        router.push("/dashboard/classes");
      } else {
        toast.error(t("OnSubmitError"), { id: "1" });
      }
    } catch {
      toast.error(t("OnSubmitError"), { id: "1" });
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Estado: sem edição seleccionada (igual aos outros ecrãs)
  if (!edition?.id) {
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
                  {t("NoEditionSelectedTitle") ?? "Edição não seleccionada"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("NoEditionSelectedDescription") ??
                    "Seleccione uma edição no topo da sidebar para criar uma turma."}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl mt-4"
                  onClick={() => router.push("/dashboard/classes")}
                >
                  <RefreshCcw className="size-4 mr-2" />
                  {t("BackButton") ?? "Voltar às turmas"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <div className="max-w-6xl mx-auto mt-10">
        {/* Header moderno (igual estilo candidates/interviews) */}
        <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-4 text-accent" />
                {`Edição: ${edition.name}`}
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                {t("Title") ?? "Criar Turma"}
              </h1>
              <p className="text-sm text-muted-foreground">{t("Subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="rounded-2xl border border-primary/15 bg-background/60 p-5 sm:p-6 max-w-xl mx-auto">
                <div className="space-y-4">
                  {/* SHIFT */}
                  <FormField
                    control={form.control}
                    name="shift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("ShiftLabel")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-xl">
                              <SelectValue
                                placeholder={t("ShiftPlaceholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MORNING">
                              {t("Shifts.Morning")}
                            </SelectItem>
                            <SelectItem value="AFTERNOON">
                              {t("Shifts.Afternoon")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CAPACITY */}
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("CapacityLabel")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("CapacityPlaceholder")}
                            className="w-full rounded-xl"
                            value={(field.value as unknown as string) ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ACTIONS */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="rounded-xl"
                    >
                      {t("SubmitButton")}
                    </Button>
                  </div>
                </div>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
