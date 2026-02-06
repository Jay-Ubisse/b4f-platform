"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/contexts/auth-context";
import { createQuizz } from "@/services/quizz";
import { ModuleProps } from "@/app/types/course";

// ⬇️ ADICIONADO AO SCHEMA
const formSchema = z.object({
  name: z.string().min(1, "O nome do quizz é obrigatório"),
  moduleId: z.string().min(1, "O módulo é obrigatório"),
  chapterId: z.string().min(1, "O capítulo é obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateQuizzDialog({
  modules,
}: {
  modules: ModuleProps[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleId: "",
      chapterId: "",
      name: "",
    },
  });

  const selectedModule = useMemo(() => {
    return modules.find((m) => m.id === form.watch("moduleId"));
  }, [form.watch("moduleId"), modules]);

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    toast.loading("A criar quizz...", { id: "1" });

    const response = await createQuizz({
      data: {
        chapterId: values.chapterId,
        createdById: user!.id,
        name: values.name,
      },
    });

    if (response.status === 201) {
      toast.success("Quizz criado com sucesso", { id: "1" });
      router.push(`/quizzes/${response.data.quizz.id}/create`);
      setOpen(false);
    } else {
      toast.error(response.data.message, { id: "1" });
    }

    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-secondary flex items-center gap-2">
          Criar Quizz
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Quizz</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do quizz *</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o nome do quizz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Módulo */}
            <FormField
              control={form.control}
              name="moduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulo *</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("chapterId", ""); // reset do capítulo
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capítulo */}
            <FormField
              control={form.control}
              name="chapterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capítulo *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedModule}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um capítulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModule?.chapters?.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-secondary"
              >
                Criar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
