"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { sanitizeFilename } from "@/lib/sanitize-filename";
import { useAuth } from "@/contexts/auth-context";
import { createCourse } from "@/services/course";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  tags: z.string().optional(),
  file: z
    .instanceof(File, { message: "Nenhum ficheiro carregado" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "O arquivo deve ter no máximo 10MB",
    })
    .refine((file) => ["image/png", "image/jpeg"].includes(file.type), {
      message: "Apenas arquivos PNG ou JPEG são permitidos",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCourseDialog() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true);
      toast.loading("A cadastrar curso...", { id: "1" });

      const fileName = sanitizeFilename(values.file.name);
      const filePath = `courses-banners/${Date.now()}_${fileName}`;

      const { error } = await supabase.storage
        .from("pu-e-learning")
        .upload(filePath, values.file);

      if (error) {
        console.error("Erro no upload:", error);
        setIsLoading(false);
        toast.error("Erro ao fazer upload da imagem", { id: "1" });
        return;
      }

      const { data: fileData } = supabase.storage
        .from("pu-e-learning")
        .getPublicUrl(filePath);

      const response = await createCourse({
        data: {
          bannerUrl: fileData.publicUrl,
          createdById: user!.id,
          name: values.name,
          tags: values.tags,
        },
      });

      if (response.status === 201) {
        toast.success("Curso cadastrado com sucesso", { id: "1" });
        setOpen(false);
        form.reset();
        setIsLoading(false);
      } else {
        toast.error("Ocorreu um erro ao cadastrar curso", { id: "1" });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao cadastrar curso", { id: "1" });
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-secondary flex items-center gap-2">
          <PlusCircle size={18} /> Novo Curso
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro de novo curso</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome do curso <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o nome do curso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tags (separadas por vírgula){" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o nome do curso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0]; // Pega o primeiro arquivo selecionado
                        field.onChange(file); // Atualiza o valor no react-hook-form
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Faça upload do banner (PNG ou JPEG)
                  </FormDescription>
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
                Criar Curso
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
