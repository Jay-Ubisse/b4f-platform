"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, User, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

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
import { passwordGenerator } from "@/lib/password-generator";
import { createUser } from "@/services/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
});

export function CreateUserForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("Dashboard.CreateUserPage");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      toast.loading(t("Form.Loading"), { id: "1" });

      const password = passwordGenerator({
        passwordLength: 8,
        useLowerCase: true,
        useNumbers: true,
        useSymbols: false,
        useUpperCase: true,
      });

      const response = await createUser({
        data: {
          email: values.email,
          name: values.name,
          password,
          role: values.role,
        },
      });

      if (response?.status === 201) {
        toast.success(t("Form.Success"), { id: "1" });
        router.push("/dashboard/users");
      } else {
        toast.error(t("Form.Error"), { id: "1" });
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(t("Form.Error"), { id: "1" });
      setIsLoading(false);
    }
  }

  return (
    <Card
      className="
        w-full overflow-hidden border-border
        bg-background/70 supports-[backdrop-filter]:bg-background/55
        supports-[backdrop-filter]:backdrop-blur-xl
        shadow-2xl
      "
    >
      {/* Top brand strip */}
      <div className="relative p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/10" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-4 text-accent" />
              {t("Form.Badge")}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              {t("Form.Title")}
            </h1>

            <p className="text-sm text-muted-foreground">
              {t("Form.Subtitle")}
            </p>
          </div>

          <Link href="/dashboard/users" className="w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto rounded-xl gap-2"
            >
              <ArrowLeft className="size-4" />
              {t("Form.GoBackButton")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="h-px w-full bg-gradient-to-r from-primary/20 via-border to-accent/20" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.NameLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("Form.NamePlaceholder")}
                        className="
                          h-11 rounded-xl pl-10
                          bg-card/60 border-border
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

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.EmailLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("Form.EmailPlaceholder")}
                        className="
                          h-11 rounded-xl pl-10
                          bg-card/60 border-border
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

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("Form.RoleLabel")}{" "}
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
                            <ShieldCheck className="size-4" />
                          </span>

                          {/* force correct color in dark */}
                          <SelectValue
                            className="text-foreground"
                            placeholder={t("Form.RolePlaceholder")}
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
                        value="RECRUITER"
                        className="
                          text-foreground rounded-lg cursor-pointer
                          focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                        "
                      >
                        {t("Form.RolesList.Recruiter")}
                      </SelectItem>

                      <SelectItem
                        value="TEACHER"
                        className="
                          text-foreground rounded-lg cursor-pointer
                          focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
                        "
                      >
                        {t("Form.RolesList.Teacher")}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                A password será gerada automaticamente e enviada por email
              </p>

              <Button
                disabled={isLoading}
                type="submit"
                className="
                  h-11 rounded-xl px-5
                  bg-gradient-to-r from-primary to-secondary
                  text-primary-foreground
                  shadow-md hover:shadow-lg transition
                "
              >
                {t("Form.SubmitButton")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}
