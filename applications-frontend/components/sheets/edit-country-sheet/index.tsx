"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Globe2, PencilLine } from "lucide-react";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CountryProps } from "@/app/types/country";
import { updateCountry } from "@/services/country";

const formSchema = z.object({
  name: z.string().trim().min(1, "Country name is required"),
});

export function EditCountrySheet({
  trigger,
  country,
}: {
  trigger: React.ReactNode;
  country: CountryProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("Dashboard.CountriesPage.EditCountrySheet");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: country.name },
  });

  // keep form in sync if country changes while component is mounted
  useEffect(() => {
    form.reset({ name: country.name });
  }, [country.id, country.name]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      toast.loading(t("Form.Loading"), { id: "1" });

      const response = await updateCountry({
        id: country.id,
        data: { name: values.name },
      });

      if (response?.status === 200) {
        toast.success(t("Form.Success"), { id: "1" });
        setIsOpen(false);
      } else if (response?.status === 409) {
        toast.error(t("Form.Error.409"), { id: "1" });
      } else {
        toast.error(t("Form.Error.500"), { id: "1" });
      }
    } catch (e) {
      console.error(e);
      toast.error(t("Form.Error.500"), { id: "1" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        className="
          overflow-y-auto border-border px-5
          bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl
        "
      >
        {/* Brand header strip */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/10" />

        <SheetHeader className="relative pt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-accent" />
            Geography • Edit
          </div>

          <div className="flex items-start gap-3">
            <div
              className="
                inline-flex size-10 items-center justify-center rounded-xl
                bg-gradient-to-br from-primary to-secondary
                text-primary-foreground ring-1 ring-white/10 shadow-sm
              "
            >
              <PencilLine className="size-5" />
            </div>

            <div className="space-y-1">
              <SheetTitle className="text-2xl font-semibold tracking-tight">
                {t("Title")}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {t("Description")}
              </SheetDescription>
            </div>
          </div>

          {/* Current value preview */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-2">
            <span
              className="
                inline-flex size-8 items-center justify-center rounded-lg
                bg-gradient-to-br from-primary to-secondary
                text-primary-foreground ring-1 ring-white/10
              "
            >
              <Globe2 className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-sm font-medium">{country.name}</p>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/20 via-border to-accent/20" />
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.CountryNameLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t("Form.CountryNamePlaceholder")}
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
