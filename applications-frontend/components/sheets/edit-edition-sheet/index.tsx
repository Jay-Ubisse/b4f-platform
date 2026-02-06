"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  Sparkles,
  Pencil,
  GraduationCap,
  Flag,
  MapPin,
  Hash,
  BookOpenCheck,
  ClipboardCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { updateEdition } from "@/services/editions";
import { getAllCourses } from "@/services/courses";
import { getAllCountries } from "@/services/country";
import { EditionProps, EditionStatus } from "@/app/types/edition";

const formSchema = z.object({
  name: z.string().trim().min(1, "Edition name is required"),
  countryId: z.string().trim().min(1, "Country is required"),
  courseId: z.string().trim().min(1, "Course is required"),
  locationId: z.string().trim().min(1, "Location is required"),
  number: z.number().int().positive(),
  year: z.number().int().positive(),
  lessonsStatus: z.nativeEnum(EditionStatus),
  applicationsStatus: z.nativeEnum(EditionStatus),
});

export function EditEditionSheet({
  trigger,
  edition,
}: {
  trigger: React.ReactNode;
  edition: EditionProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations("Dashboard.EditionsPage.EditEditionSheet");

  const { isPending: isCoursesPending, data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getAllCourses(),
    refetchInterval: 5000,
  });

  const { isPending: isCountriesPending, data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getAllCountries(),
    refetchInterval: 5000,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: edition.name,
      number: edition.number,
      year: edition.year,
      courseId: edition.course?.id ?? "",
      applicationsStatus: edition.applicationsStatus,
      lessonsStatus: edition.lessonsStatus,
      countryId: "",
      locationId: "",
    },
  });

  const initialCountryId = useMemo(() => {
    if (!countries) return "";
    const byId = countries.find((c) => c.id === edition.country?.id)?.id;
    if (byId) return byId;
    const byName = countries.find((c) => c.name === edition.country?.name)?.id;
    return byName ?? "";
  }, [countries, edition.country]);

  const initialLocationId = useMemo(() => {
    if (!countries) return "";
    const country =
      countries.find((c) => c.id === edition.country?.id) ??
      countries.find((c) => c.name === edition.country?.name);

    const byId = country?.locations?.find(
      (l) => l.id === edition.location?.id,
    )?.id;
    if (byId) return byId;

    const byName = country?.locations?.find(
      (l) => l.name === edition.location?.name,
    )?.id;
    return byName ?? "";
  }, [countries, edition.country, edition.location]);

  // Preencher IDs assim que countries carregar (sem usar useMemo para side-effects)
  useEffect(() => {
    if (!countries) return;

    if (initialCountryId && form.getValues("countryId") !== initialCountryId) {
      form.setValue("countryId", initialCountryId);
    }

    if (
      initialLocationId &&
      form.getValues("locationId") !== initialLocationId
    ) {
      form.setValue("locationId", initialLocationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, initialCountryId, initialLocationId]);

  const selectedCountryId = form.watch("countryId");

  const selectedCountry = useMemo(() => {
    if (!countries || !selectedCountryId) return undefined;
    return countries.find((c) => c.id === selectedCountryId);
  }, [countries, selectedCountryId]);

  const availableLocations = selectedCountry?.locations ?? [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      toast.loading(t("Form.Loading"), { id: "1" });

      const response = await updateEdition({
        id: edition.id,
        data: {
          name: values.name,
          number: values.number,
          year: values.year,
          courseId: values.courseId,
          countryId: values.countryId,
          locationId: values.locationId,
          applicationsStatus: values.applicationsStatus,
          lessonsStatus: values.lessonsStatus,
        },
      });

      if (response?.status === 200) {
        toast.success(t("Form.Success"), { id: "1" });
        form.reset(values);
        setIsOpen(false);
      } else {
        toast.error(t("Form.Error"), { id: "1" });
      }
    } catch (e) {
      console.error(e);
      toast.error(t("Form.Error"), { id: "1" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        className="
          overflow-y-auto border-border
          bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl
        "
      >
        {/* Brand strip */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/10" />

        <SheetHeader className="relative pt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-accent" />
            Editions • Edit
          </div>

          <div className="flex items-start gap-3">
            <div
              className="
                inline-flex size-10 items-center justify-center rounded-xl
                bg-gradient-to-br from-primary to-secondary
                text-primary-foreground ring-1 ring-white/10 shadow-sm
              "
            >
              <Pencil className="size-5" />
            </div>

            <div className="space-y-1 min-w-0">
              <SheetTitle className="text-2xl font-semibold tracking-tight">
                {t("Title")}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {t("Description")}
              </SheetDescription>
            </div>
          </div>

          {/* Quick info (icons fixed + truncation) */}
          <div className="mt-5 grid gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-2">
              <span
                className="
                  inline-flex size-8 shrink-0 items-center justify-center rounded-lg
                  bg-gradient-to-br from-primary to-secondary
                  text-primary-foreground ring-1 ring-white/10
                "
              >
                <Hash className="size-4" />
              </span>
              <div className="leading-tight min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  {"Current edition number"}
                </p>
                <p className="text-sm font-medium truncate">
                  #{edition.number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-2">
              <span
                className="
                  inline-flex size-8 shrink-0 items-center justify-center rounded-lg
                  bg-gradient-to-br from-primary to-secondary
                  text-primary-foreground ring-1 ring-white/10
                "
              >
                <CalendarIcon className="size-4" />
              </span>
              <div className="leading-tight min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  {"Current edition year"}
                </p>
                <p className="text-sm font-medium truncate">{edition.year}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/20 via-border to-accent/20" />
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 sm:mt-1 space-y-5 px-2"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EditionNameLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Form.EditionNamePlaceholder")}
                      {...field}
                      className="
                        h-11 rounded-xl
                        bg-card/60 border-border
                        focus-visible:ring-2 focus-visible:ring-ring
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NUMBER */}
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EditionNumberLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("Form.EditionNumberPlaceholder")}
                        type="number"
                        className="
                          h-11 rounded-xl pl-9
                          bg-card/60 border-border
                          focus-visible:ring-2 focus-visible:ring-ring
                        "
                        value={(field.value as unknown as string) ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* COURSE */}
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EditionCourseLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className="
                          h-11 w-full rounded-xl
                          bg-card/60 border-border
                          focus:ring-2 focus:ring-ring
                          relative overflow-hidden
                        "
                      >
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                        <span className="relative inline-flex items-center gap-2 min-w-0">
                          <span
                            className="
                              inline-flex size-7 shrink-0 items-center justify-center rounded-lg
                              bg-gradient-to-br from-primary to-secondary
                              text-primary-foreground ring-1 ring-white/10
                            "
                          >
                            <GraduationCap className="size-4 text-primary-foreground" />
                          </span>
                          <SelectValue
                            placeholder={t("Form.EditionCoursePlaceholder")}
                          />
                        </span>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent
                      className="
                        rounded-xl border border-border
                        bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                        shadow-xl
                      "
                    >
                      {isCoursesPending ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          {t("Form.LoadingCourses")}
                        </p>
                      ) : !courses || courses.length === 0 ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          {t("Form.NoCoursesFound")}
                        </p>
                      ) : (
                        courses.map((course) => (
                          <SelectItem
                            value={course.id}
                            key={course.id}
                            className="
                              text-foreground rounded-lg cursor-pointer
                              focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                            "
                          >
                            <span className="truncate">{course.name}</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* YEAR */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => {
                const currentYear = new Date().getFullYear();
                const years = Array.from(
                  { length: currentYear - 1899 },
                  (_, i) => 1900 + i,
                ).reverse();

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm">
                      {t("Form.EditionYearLabel")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            type="button"
                            className={cn(
                              `
                                h-11 w-full rounded-xl justify-start
                                bg-card/60 border-border
                                focus-visible:ring-2 focus-visible:ring-ring
                                relative overflow-hidden
                              `,
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                            <span className="relative flex w-full items-center gap-2 min-w-0">
                              <span
                                className="
                                  inline-flex size-7 shrink-0 items-center justify-center rounded-lg
                                  bg-gradient-to-br from-primary to-secondary
                                  text-primary-foreground ring-1 ring-white/10
                                "
                              >
                                <CalendarIcon className="size-4 text-primary-foreground" />
                              </span>
                              <span className="truncate">
                                {field.value
                                  ? field.value
                                  : t("Form.EditionYearPlaceholder")}
                              </span>
                              <span className="ml-auto shrink-0 text-muted-foreground">
                                ▼
                              </span>
                            </span>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent
                        className="
                          w-[260px] p-2 rounded-xl border border-border
                          bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                          shadow-xl
                        "
                        align="start"
                      >
                        <div className="max-h-[220px] overflow-y-auto pr-1">
                          {years.map((year) => (
                            <Button
                              key={year}
                              variant={
                                field.value === year ? "default" : "ghost"
                              }
                              type="button"
                              className={cn(
                                "w-full justify-start rounded-lg",
                                field.value === year &&
                                  "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
                              )}
                              onClick={() => field.onChange(year)}
                            >
                              {year}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* COUNTRY */}
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EditionCountryLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={(countryId) => {
                      field.onChange(countryId);
                      form.setValue("locationId", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="
                          h-11 w-full rounded-xl
                          bg-card/60 border-border
                          focus:ring-2 focus:ring-ring
                          relative overflow-hidden
                        "
                      >
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                        <span className="relative inline-flex items-center gap-2 min-w-0">
                          <span
                            className="
                              inline-flex size-7 shrink-0 items-center justify-center rounded-lg
                              bg-gradient-to-br from-primary to-secondary
                              text-primary-foreground ring-1 ring-white/10
                            "
                          >
                            <Flag className="size-4 text-primary-foreground" />
                          </span>
                          <SelectValue
                            placeholder={t("Form.EditionCountryPlaceholder")}
                          />
                        </span>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent
                      className="
                        rounded-xl border border-border
                        bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                        shadow-xl
                      "
                    >
                      {isCountriesPending ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          {t("Form.LoadingCountries") ?? "Loading countries..."}
                        </p>
                      ) : !countries || countries.length === 0 ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          {t("Form.NoCountriesFound") ?? "No countries found"}
                        </p>
                      ) : (
                        countries.map((country) => (
                          <SelectItem
                            key={country.id}
                            value={country.id}
                            className="
                              text-foreground rounded-lg cursor-pointer
                              focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                            "
                          >
                            <span className="truncate">{country.name}</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LOCATION */}
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EditionLocationLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedCountryId}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="
                          h-11 w-full rounded-xl
                          bg-card/60 border-border
                          focus:ring-2 focus:ring-ring
                          relative overflow-hidden
                        "
                      >
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                        <span className="relative inline-flex items-center gap-2 min-w-0">
                          <span
                            className="
                              inline-flex size-7 shrink-0 items-center justify-center rounded-lg
                              bg-gradient-to-br from-primary to-secondary
                              text-primary-foreground ring-1 ring-white/10
                            "
                          >
                            <MapPin className="size-4 text-primary-foreground" />
                          </span>
                          <SelectValue
                            placeholder={t("Form.EditionLocationPlaceholder")}
                          />
                        </span>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent
                      className="
                        rounded-xl border border-border
                        bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                        shadow-xl
                      "
                    >
                      {!selectedCountryId ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          {t("Form.SelectCountryFirst") ??
                            "Select a country first"}
                        </p>
                      ) : availableLocations.length === 0 ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          {t("Form.NoLocationsFound") ??
                            "No locations found for this country"}
                        </p>
                      ) : (
                        availableLocations.map((location) => (
                          <SelectItem
                            key={location.id}
                            value={location.id}
                            className="
                              text-foreground rounded-lg cursor-pointer
                              focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                            "
                          >
                            <span className="truncate">{location.name}</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* APPLICATIONS STATUS */}
            <FormField
              control={form.control}
              name="applicationsStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EditionApplicationsStatusLabel")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className="
                          h-11 w-full rounded-xl
                          bg-card/60 border-border
                          focus:ring-2 focus:ring-ring
                          relative overflow-hidden
                        "
                      >
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                        <span className="relative inline-flex items-center gap-2 min-w-0">
                          <span
                            className="
                              inline-flex size-7 shrink-0 items-center justify-center rounded-lg
                              bg-gradient-to-br from-primary to-secondary
                              text-primary-foreground ring-1 ring-white/10
                            "
                          >
                            <ClipboardCheck className="size-4 text-primary-foreground" />
                          </span>
                          <SelectValue
                            placeholder={
                              t("Form.Status.Placeholder") ?? "Select status"
                            }
                          />
                        </span>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent
                      className="
                        rounded-xl border border-border
                        bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                        shadow-xl
                      "
                    >
                      <SelectItem
                        value={EditionStatus.OPEN}
                        className="rounded-lg"
                      >
                        {t("Form.Status.Open")}
                      </SelectItem>
                      <SelectItem
                        value={EditionStatus.CLOSED}
                        className="rounded-lg"
                      >
                        {t("Form.Status.Closed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LESSONS STATUS */}
            <FormField
              control={form.control}
              name="lessonsStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EditionLessonsStatusLabel")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className="
                          h-11 w-full rounded-xl
                          bg-card/60 border-border
                          focus:ring-2 focus:ring-ring
                          relative overflow-hidden
                        "
                      >
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                        <span className="relative inline-flex items-center gap-2 min-w-0">
                          <span
                            className="
                              inline-flex size-7 shrink-0 items-center justify-center rounded-lg
                              bg-gradient-to-br from-primary to-secondary
                              text-primary-foreground ring-1 ring-white/10
                            "
                          >
                            <BookOpenCheck className="size-4 text-primary-foreground" />
                          </span>
                          <SelectValue
                            placeholder={
                              t("Form.Status.Placeholder") ?? "Select status"
                            }
                          />
                        </span>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent
                      className="
                        rounded-xl border border-border
                        bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
                        shadow-xl
                      "
                    >
                      <SelectItem
                        value={EditionStatus.OPEN}
                        className="rounded-lg"
                      >
                        {t("Form.Status.Open")}
                      </SelectItem>
                      <SelectItem
                        value={EditionStatus.CLOSED}
                        className="rounded-lg"
                      >
                        {t("Form.Status.Closed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2 sm:gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="
                  h-11 rounded-xl px-5
                  bg-gradient-to-r from-primary to-secondary
                  text-primary-foreground
                  shadow-md hover:shadow-lg transition
                  disabled:opacity-60
                "
              >
                {t("Form.SubmitButton")}
              </Button>

              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl"
                >
                  {t("Form.CloseButton")}
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
