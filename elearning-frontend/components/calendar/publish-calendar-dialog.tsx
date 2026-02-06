import toast from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEdition } from "@/contexts/edition-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { sanitizeFilename } from "@/lib/sanitize-filename";
import { publishCalendar } from "@/services/calendar";
import { Input } from "../ui/input";

const formSchema = z.object({
  file: z
    .instanceof(File, { message: "Nenhum ficheiro carregado" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "O arquivo deve ter no máximo 10MB",
    })
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
      {
        message: "Apenas arquivos PNG, JPEG ou PDF são permitidos",
      }
    ),
});

export function PublishCalendarDialog() {
  const { edition } = useEdition();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast.loading("A publicar calendário...", { id: "1" });
      setIsLoading(true);

      const fileName = sanitizeFilename(values.file.name);
      const filePath = `calendars/${Date.now()}_${fileName}`;

      const { error } = await supabase.storage
        .from("pu-e-learning") // substitua pelo nome do seu bucket
        .upload(filePath, values.file);

      if (error) {
        console.error("Erro no upload:", error);
        setIsLoading(false);
        toast.error("Erro ao fazer upload do documento", { id: "1" });
        return;
      }

      const { data: fileData } = supabase.storage
        .from("pu-e-learning")
        .getPublicUrl(filePath);

      const response = await publishCalendar({
        data: {
          calendarUrl: fileData.publicUrl,
          editionId: edition?.id,
        },
      });

      if (response?.status === 201) {
        toast.success("Calendário publicado com sucesso!", { id: "1" });
      } else {
        toast.error("Erro ao publicar calendário, tente de novo.", { id: "1" });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao publicar calendário, tente de novo.", { id: "1" });
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Publicar calendário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className="text-center text-xl font-semibold mb-4">
              Publicar Calendário
            </h1>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calendário</FormLabel>
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
                      Faça upload do calendário (Imagem ou PDF)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  Publicar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
