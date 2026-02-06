"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endInterview } from "@/services/interviews";
import { supabase } from "@/lib/supabase-client";
import { sanitizeFilename } from "@/lib/sanitize-filename";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  observations: z.string(),
  result: z.string(),
  interviewGuide: z
    .instanceof(File, { message: "Nenhum ficheiro carregado" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "O arquivo deve ter no máximo 10MB",
    })
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
      {
        message: "Apenas arquivos PNG, JPEG ou PDF são permitidos",
      },
    )
    .optional(),
});

export function EndInterviewForm({ interviewId }: { interviewId: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("Dashboard.InterviewDetailsPage.EndInterviewForm");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      toast.loading(t("OnSubmitLoading"), { id: "1" });

      let interviewGuideUrl: string = "";

      if (values.interviewGuide) {
        const fileName = sanitizeFilename(values.interviewGuide.name);
        const filePath = `interview-guides/${Date.now()}_${fileName}`;

        const { error } = await supabase.storage
          .from("pu-e-learning") // nome do bucket
          .upload(filePath, values.interviewGuide);

        if (error) {
          console.error("Erro no upload:", error);
          setIsLoading(false);
          toast.error("Erro ao fazer upload do documento", { id: "1" });
          return;
        }

        const { data: fileData } = supabase.storage
          .from("pu-e-learning")
          .getPublicUrl(filePath);

        interviewGuideUrl = fileData.publicUrl;
      }

      const response = await endInterview({
        id: interviewId,
        data: {
          result: values.result,
          observations: values.observations,
          interviewGuideUrl,
        },
      });

      if (response?.status === 200) {
        console.log(response);
        toast.success(t("OnSubmitSuccess"), { id: "1" });
      } else {
        console.log("Erro", response);
        toast.error(t("OnSubmitError"), { id: "1" });
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(t("OnSubmitError"), {
        id: "1",
      });
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="interviewGuide"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guião de entrevistas</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Faça upload do guião (Imagem ou PDF)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="result"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("InterviewResultLabel")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue
                        placeholder={t("InterviewResultPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMITTED">
                      {t("InterviewResultsList.Admitted")}
                    </SelectItem>
                    <SelectItem value="NOT_ADMITTED">
                      {t("InterviewResultsList.NotAdmitted")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("InterviewObservationsLabel")}{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("InterviewObservationsPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isLoading}
          className="ml-auto rounded-xl"
          type="submit"
        >
          {t("SubmitButton")}
        </Button>
      </form>
    </Form>
  );
}
