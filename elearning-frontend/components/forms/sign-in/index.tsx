"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { useEdition } from "@/contexts/edition-context";

const formSchema = z.object({
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(8, "A palavra-passe deve ter 8 caracteres no mínimo")
    .max(16, "A palavra-passe deve der entre 8 a 16 caracteres"),
});

export function SignInForm({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { changeEdition } = useEdition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      toast.loading("A iniciar sessão...", { id: "1" });
      const response = await login({
        data: { email: values.email, password: values.password },
        setUser,
        changeEdition,
      });

      if (response.status === 401) {
        toast.error("Credenciais inválidas. Tente novamente.", { id: "1" });
        setLoading(false);
        return;
      }

      if (response.status === 200) {
        toast.success("Sessão iniciada com sucesso!", { id: "1" });
        router.push("/overview");
      } else {
        toast.error("Erro ao iniciar sessão. Tente novamente.", { id: "1" });
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao iniciar sessão. Tente novamente.", { id: "1" });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Bem-vindo(a) de volta</h1>
                  <p className="text-muted-foreground text-balance">
                    Entre na sua conta Bytes 4 Future
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Palavra-Passe{" "}
                          <Link
                            href="#"
                            className="ml-auto font-light text-sm underline-offset-2 hover:underline"
                          >
                            Esqueceu sua palavra-passe?
                          </Link>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a palavra-passe"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="relative hidden md:block">
            <div className="h-full w-full bg-primary flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-secondary mb-4">
                Power Up e-Learning
              </h1>
              <h2 className="text-xl text-secondary font-bold">
                Bytes 4 Future
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
