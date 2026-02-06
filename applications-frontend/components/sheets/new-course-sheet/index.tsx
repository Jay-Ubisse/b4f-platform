"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Plus, GraduationCap, Sparkles, Layers } from "lucide-react";

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
import { createCourse } from "@/services/courses";
import { useAuth } from "@/contexts/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseModality } from "@/app/types/course";

const formSchema = z.object({
  name: z.string().trim().min(1, "Course name is required"),
  modality: z.string().min(1, "Course modality is required"),
});

export function NewCourseSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const t = useTranslations("Dashboard.CoursesPage.NewCourseSheet");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", modality: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      toast.loading(t("Form.Loading"), { id: "1" });

      const response = await createCourse({
        data: {
          name: values.name,
          modality: values.modality as CourseModality,
          createdById: user!.id,
        },
      });

      if (response?.status === 201) {
        toast.success(t("Form.Success"), { id: "1" });
        form.reset();
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
      <SheetTrigger asChild>
        <Button
          className="
            h-11 rounded-xl px-4
            bg-gradient-to-r from-primary to-secondary
            text-primary-foreground
            shadow-md hover:shadow-lg transition
          "
        >
          <span
            className="
              mr-2 inline-flex size-8 items-center justify-center rounded-lg
              bg-white/10 ring-1 ring-white/10
            "
          >
            <Plus className="size-4" />
          </span>
          <span className="font-medium">{t("NewCourseButton")}</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        className="
          overflow-y-auto border-border px-4
          bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl
        "
      >
        {/* Brand header strip */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/10" />

        <SheetHeader className="relative pt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-accent" />
            {t("Badge")}
          </div>

          <div className="flex items-start gap-3">
            <div
              className="
                inline-flex size-10 items-center justify-center rounded-xl
                bg-gradient-to-br from-primary to-secondary
                text-primary-foreground ring-1 ring-white/10 shadow-sm
              "
            >
              <GraduationCap className="size-5" />
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
                    {t("Form.CourseNameLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t("Form.CourseNamePlaceholder")}
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

            <FormField
              control={form.control}
              name="modality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.CourseModalityLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                        {/* gradient overlay */}
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                        <span className="relative inline-flex items-center gap-2">
                          <span
                            className="
                              inline-flex size-7 items-center justify-center rounded-lg
                              bg-gradient-to-br from-primary to-secondary
                              text-primary-foreground ring-1 ring-white/10
                            "
                          >
                            <Layers className="size-4" />
                          </span>

                          <SelectValue
                            className="text-foreground"
                            placeholder={t("Form.CourseModalityPlaceholder")}
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
                        value="IN_PERSON"
                        className="
                          text-foreground rounded-lg cursor-pointer
                          focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                        "
                      >
                        {t("Form.ModalitiesList.InPerson")}
                      </SelectItem>

                      <SelectItem
                        value="ONLINE"
                        className="
                          text-foreground rounded-lg cursor-pointer
                          focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                        "
                      >
                        {t("Form.ModalitiesList.Online")}
                      </SelectItem>

                      <SelectItem
                        value="HYBRID"
                        className="
                          text-foreground rounded-lg cursor-pointer
                          focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                        "
                      >
                        {t("Form.ModalitiesList.Hybrid")}
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
