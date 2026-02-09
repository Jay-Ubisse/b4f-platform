"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, TriangleAlert, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { createCandidate } from "@/services/candidates";
import { getEditions } from "@/services/editions";
import { EditionProps, EditionStatus } from "@/app/types/edition";

const formSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório"),
  birthDate: z.date({ required_error: "Data de nascimento obrigatória" }),
  gender: z.string().min(1, "Género obrigatório"),
  email: z.string().trim().email("Email inválido"),
  phone: z.string().trim().min(6, "Contacto obrigatório"),
  whatsapp: z.string().trim().optional(),

  countryId: z.string().min(1, "Select a country"),
  courseId: z.string().min(1, "Select a course"),
  locationId: z.string().min(1, "Select a location"),

  motivation: z.string().trim().min(10, "Motivação obrigatória"),
});

export function CandidateApplicationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Public.ApplicationPage");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      email: "",
      phone: "",
      whatsapp: "",
      motivation: "",
      countryId: "",
      courseId: "",
      locationId: "",
    },
  });

  const {
    isPending: isEditionsPending,
    data: editions,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["editions"],
    queryFn: () => getEditions(),
    refetchInterval: 5000,
  });

  // apenas edições com candidaturas abertas
  const openEditions = useMemo(() => {
    return (
      editions?.filter(
        (e: EditionProps) => e.applicationsStatus === EditionStatus.OPEN,
      ) ?? []
    );
  }, [editions]);

  const selectedCountryId = form.watch("countryId");
  const selectedCourseId = form.watch("courseId");
  const selectedLocationId = form.watch("locationId");

  // países disponíveis (a partir das edições OPEN)
  const countries = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    openEditions.forEach((e) => {
      if (e.country?.id) {
        map.set(e.country.id, { id: e.country.id, name: e.country.name });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [openEditions]);

  // cursos no país seleccionado
  const coursesInCountry = useMemo(() => {
    if (!selectedCountryId) return [];
    const map = new Map<string, { id: string; name: string }>();

    openEditions
      .filter((e) => e.countryId === selectedCountryId)
      .forEach((e) => {
        if (e.course?.id) {
          map.set(e.course.id, { id: e.course.id, name: e.course.name });
        }
      });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [openEditions, selectedCountryId]);

  // locais no país+curso seleccionados
  const locationsForCourse = useMemo(() => {
    if (!selectedCountryId || !selectedCourseId) return [];
    const map = new Map<string, { id: string; name: string }>();

    openEditions
      .filter(
        (e) =>
          e.countryId === selectedCountryId && e.courseId === selectedCourseId,
      )
      .forEach((e) => {
        if (e.location?.id) {
          map.set(e.location.id, { id: e.location.id, name: e.location.name });
        }
      });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [openEditions, selectedCountryId, selectedCourseId]);

  // edição inferida automaticamente
  const inferredEdition = useMemo(() => {
    if (!selectedCountryId || !selectedCourseId || !selectedLocationId)
      return undefined;

    const matches = openEditions
      .filter(
        (e) =>
          e.countryId === selectedCountryId &&
          e.courseId === selectedCourseId &&
          e.locationId === selectedLocationId,
      )
      .sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.number - a.number;
      });

    return matches[0];
  }, [openEditions, selectedCountryId, selectedCourseId, selectedLocationId]);

  const inferredEditionId = inferredEdition?.id;

  // estados iniciais
  if (isEditionsPending) {
    return (
      <div className="flex items-center justify-center py-14">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15">
            <TriangleAlert className="size-5" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold">{t("LoadErrorTitle")}</p>
            <p className="text-sm text-white/80">{t("LoadErrorSubtitle")}</p>

            <div className="mt-3">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl"
                onClick={() => refetch()}
              >
                {t("Refresh")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!editions || editions.length === 0 || openEditions.length === 0) {
    return (
      <Card className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15">
            <TriangleAlert className="size-5" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {t("EditionNotFoundTitle") ?? "Candidaturas indisponíveis"}
            </p>
            <p className="text-sm text-white/80">
              {t("EditionNotFound") ??
                "De momento não existem edições com candidaturas abertas."}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!inferredEditionId) {
      toast.error(t("Form.EditionInferenceError"), { id: "1" });
      return;
    }

    try {
      setIsLoading(true);
      toast.loading(t("Form.Processing"), { id: "1" });

      const response = await createCandidate({
        data: {
          editionId: inferredEditionId,
          birthDate: values.birthDate,
          email: values.email,
          motivation: values.motivation,
          name: values.name,
          gender: values.gender,
          phone: values.phone,
          status: "PENDING",
          whatsapp: values.whatsapp,
        },
      });

      if (response?.status === 201) {
        toast.success(t("Form.Success"), { id: "1" });
        router.push(`/candidate/${response.data.candidate.id}`);
      } else {
        toast.error(t("Form.Error"), { id: "1" });
      }
    } catch (error) {
      console.log(error);
      toast.error(t("Form.Error"), { id: "1" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85">
            <Sparkles className="size-4" />
            {/**t("Form.Badge") ?? */ "Formulário de Candidatura"}
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {t("Form.Title")}{" "}
            <span className="text-white/90">Bytes4Future</span>
          </h1>

          <p className="text-sm text-white/80">
            {
              /**t("Form.Subtitle") ?? */
              "Preencha os seus dados e escolha o local/curso disponível."
            }
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="rounded-2xl border border-white/15 bg-white/10 p-5 sm:p-6 md:p-8 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-white">
                      {t("Form.NameLabel")}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Form.NamePlaceholder")}
                        className="rounded-xl bg-white/90"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data nascimento */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">
                      {t("Form.BirthDateLabel")}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full rounded-xl bg-white/90 justify-between text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            type="button"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("Form.BirthDatePlaceholder")}</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Género */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {t("Form.GenderLabel")}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl bg-white/90">
                          <SelectValue
                            placeholder={t("Form.GenderPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">
                          {t("Form.GendersList.Male")}
                        </SelectItem>
                        <SelectItem value="FEMALE">
                          {t("Form.GendersList.Female")}
                        </SelectItem>
                        <SelectItem value="OTHER">
                          {t("Form.GendersList.Other")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {t("Form.EmailLabel")}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Form.EmailPlaceholder")}
                        className="rounded-xl bg-white/90"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telefone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {t("Form.PhoneLabel")}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder={t("Form.PhonePlaceholder")}
                        className="rounded-xl bg-white/90"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WhatsApp */}
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-white">
                      {t("Form.WhatsAppLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder={t("Form.WhatsAppPlaceholder")}
                        className="rounded-xl bg-white/90"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* País */}
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {t("Form.CountryLabel") ?? "País"}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={(countryId) => {
                        field.onChange(countryId);
                        form.setValue("courseId", "");
                        form.setValue("locationId", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl bg-white/90">
                          <SelectValue
                            placeholder={
                              t("Form.CountryPlaceholder") ?? "Selecione o país"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Curso */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {t("Form.CourseLabel")}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={(courseId) => {
                        field.onChange(courseId);
                        form.setValue("locationId", "");
                      }}
                      disabled={!selectedCountryId}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl bg-white/90">
                          <SelectValue
                            placeholder={
                              selectedCountryId
                                ? (t("Form.CoursePlaceholder") ??
                                  "Selecione o curso")
                                : (t("Form.SelectCountryFirst") ??
                                  "Selecione o país primeiro")
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {!selectedCountryId ? (
                          <p className="px-2 py-1 text-xs text-muted-foreground">
                            {t("Form.SelectCountryFirst") ??
                              "Selecione o país primeiro"}
                          </p>
                        ) : coursesInCountry.length === 0 ? (
                          <p className="px-2 py-1 text-xs text-muted-foreground">
                            {t("Form.NoCoursesFound") ??
                              "Nenhum curso disponível neste país"}
                          </p>
                        ) : (
                          coursesInCountry.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Local */}
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-white">
                      {t("Form.LocationLabel") ?? "Local / Conselho"}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedCountryId || !selectedCourseId}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl bg-white/90">
                          <SelectValue
                            placeholder={
                              !selectedCountryId
                                ? (t("Form.SelectCountryFirst") ??
                                  "Selecione o país primeiro")
                                : !selectedCourseId
                                  ? (t("Form.SelectCourseFirst") ??
                                    "Selecione o curso primeiro")
                                  : (t("Form.LocationPlaceholder") ??
                                    "Selecione o local")
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {!selectedCountryId ? (
                          <p className="px-2 py-1 text-xs text-muted-foreground">
                            {t("Form.SelectCountryFirst") ??
                              "Selecione o país primeiro"}
                          </p>
                        ) : !selectedCourseId ? (
                          <p className="px-2 py-1 text-xs text-muted-foreground">
                            {t("Form.SelectCourseFirst") ??
                              "Selecione o curso primeiro"}
                          </p>
                        ) : locationsForCourse.length === 0 ? (
                          <p className="px-2 py-1 text-xs text-muted-foreground">
                            {t("Form.NoLocationsFound") ??
                              "Nenhum local disponível para este curso neste país"}
                          </p>
                        ) : (
                          locationsForCourse.map((l) => (
                            <SelectItem key={l.id} value={l.id}>
                              {l.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Motivação */}
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-white">
                      {t("Form.MotivationLabel")}{" "}
                      <span className="text-red-300">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("Form.MotivationPlaceholder")}
                        className="min-h-28 resize-none rounded-xl bg-white/90"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-xs text-white/70">
                {
                  /**t("Form.FooterHint") ?? */
                  "Ao submeter, receberá um link para acompanhar o estado da candidatura."
                }
              </p>

              <Button
                disabled={isLoading || !inferredEditionId}
                type="submit"
                className="rounded-xl bg-emerald-700 hover:bg-emerald-700/90"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {/**t("Form.Processing") ?? */ "A processar..."}
                  </span>
                ) : (
                  t("Form.SendButton")
                )}
              </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
