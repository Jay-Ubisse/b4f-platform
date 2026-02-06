"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { login } from "@/services/auth";
import { useAuth } from "@/contexts/auth-context";
import { useEdition } from "@/contexts/edition-contentx";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const { changeEdition } = useEdition();
  const t = useTranslations("Public.SignInPage");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      toast.loading(t("Loading"), { id: "1" });

      const response = await login({
        data: { email: values.email, password: values.password },
        setUser,
        changeEdition,
      });

      if (response.status === 401) {
        toast.error(t("InvalidCredentials"), { id: "1" });
        setLoading(false);
        return;
      }

      if (response.status === 200) {
        toast.success(t("Success"), { id: "1" });
        router.push("/dashboard/overview");
      } else {
        toast.error(t("Error"), { id: "1" });
      }

      setLoading(false);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error(t("Error"), { id: "1" });
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "relative min-h-[100svh] overflow-hidden bg-background",
        className,
      )}
      {...props}
    >
      {/* Background (tech gradient + soft grid) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-accent/15" />
        <div className="absolute -top-24 -left-24 size-[420px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 size-[420px] rounded-full bg-secondary/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Top right controls */}
      <div className="fixed right-5 top-5 z-20 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-10">
        <Card
          className="
            w-full max-w-5xl overflow-hidden border-border
            bg-background/70 supports-[backdrop-filter]:bg-background/55
            supports-[backdrop-filter]:backdrop-blur-xl
            shadow-2xl
          "
        >
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Left: Form */}
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-accent" />
                  {t("Form.Badge")}
                </div>

                <h1 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                  {t("Form.Title")}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("Form.Subtitle")}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          {t("Form.EmailLabel")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder={t("Form.EmailPlaceholder")}
                              className="
                                h-11 rounded-xl pl-10
                                bg-card/60
                                border-border
                                focus-visible:ring-2 focus-visible:ring-ring
                              "
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-3">
                          <FormLabel className="text-sm">
                            {t("Form.PasswordLabel")}
                          </FormLabel>

                          <Link
                            href="#"
                            className="
                              text-xs text-muted-foreground underline-offset-4
                              hover:text-foreground hover:underline
                            "
                          >
                            {t("Form.ForgotPassword")}
                          </Link>
                        </div>

                        <FormControl>
                          <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder={t("Form.PasswordPlaceholder")}
                              type="password"
                              className="
                                h-11 rounded-xl pl-10
                                bg-card/60
                                border-border
                                focus-visible:ring-2 focus-visible:ring-ring
                              "
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="
                      group h-11 w-full rounded-xl
                      bg-gradient-to-r from-primary to-secondary
                      text-primary-foreground
                      shadow-md
                      hover:shadow-lg
                      disabled:opacity-60
                    "
                  >
                    <span className="flex items-center justify-center gap-2">
                      {t("Form.SubmitButton")}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Button>
                </form>
              </Form>
            </div>

            {/* Right: Brand / Visual */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url(/login-background.jpg)] bg-cover bg-center" />
                {/* overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-black/70" />
                {/* brand glow */}
                <div className="absolute -top-16 -left-16 size-[320px] rounded-full bg-primary/25 blur-3xl" />
                <div className="absolute -bottom-16 -right-16 size-[320px] rounded-full bg-accent/15 blur-3xl" />
              </div>

              <div className="relative flex h-full flex-col justify-between p-10">
                <div className="flex items-center gap-2">
                  <div
                    className="
                      inline-flex size-10 items-center justify-center rounded-xl
                      bg-gradient-to-br from-primary to-secondary
                      text-primary-foreground font-bold
                      ring-1 ring-white/10
                    "
                  >
                    B
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm text-white/70">{t("Card.Welcome")}</p>
                    <p className="text-lg font-semibold text-white">
                      Bytes<span className="text-accent">4</span>Future
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold text-white">
                    {t("Card.Title")}
                  </h2>
                  <p className="max-w-sm text-sm text-white/70">
                    {t("Card.Intro")}
                  </p>

                  <div className="grid gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm text-white/80">
                        <span className="text-accent">●</span>{" "}
                        {t("Card.Modules.Dashboards")}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm text-white/80">
                        <span className="text-accent">●</span>{" "}
                        {t("Card.Modules.ApplicationsManagement")}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm text-white/80">
                        <span className="text-accent">●</span>{" "}
                        {t("Card.Modules.LessonsManagement")}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/50">
                  © {new Date().getFullYear()} Bytes 4 Future —{" "}
                  {t("Card.Copyright")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
