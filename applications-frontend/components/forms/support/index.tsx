"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Sparkles, LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório"),
  email: z.string().trim().email("Email inválido"),
  subject: z.string().trim().min(3, "Assunto obrigatório"),
  message: z.string().trim().min(10, "Mensagem muito curta"),
});

export function HelpCenterForm() {
  const t = useTranslations("Dashboard.SupportPage");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: ligar API/email
    toast.success(t("FormSubmissionSuccess"), { id: "1" });
    console.log(values);
    form.reset();
  }

  return (
    <div>
      {/* Header moderno (igual aos outros ecrãs) */}
      <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-4 text-accent" />
              {t("BreadCrumbTitile")}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              {t("PageTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("HelpCenterSubtitle")}
            </p>
          </div>

          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground ring-1 ring-white/10">
            <LifeBuoy className="size-5" />
          </span>
        </div>
      </div>

      {/* Form Card */}
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="rounded-2xl border border-primary/15 bg-background/60 p-5 sm:p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>
                        {t("Form.NameLabel")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Form.NamePlaceholder")}
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>
                        {t("Form.EmailLabel")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Form.EmailPlaceholder")}
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>
                        {t("Form.SubjectLabel")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("Form.SubjectPlaceholder")}
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>
                        {t("Form.MessageLabel")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("Form.MessagePlaceholder")}
                          className="resize-none rounded-xl min-h-[140px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => form.reset()}
                >
                  {t("Form.ResetButton") ?? "Limpar"}
                </Button>

                <Button type="submit" className="rounded-xl hover:bg-primary">
                  {t("Form.SubmitButton")}
                </Button>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
