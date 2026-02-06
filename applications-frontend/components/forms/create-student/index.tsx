"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStudent } from "@/services/students";
import { getClasses } from "@/services/classes";
import { CandidateProps } from "@/app/types/candidates";

const formSchema = z.object({
  classId: z.string(),
});

export function CreateStudentForm({
  candidate,
}: {
  candidate: CandidateProps;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("Dashboard.InterviewDetailsPage.CreateStudentForm");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isPending, data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getClasses(),
    refetchInterval: 5000,
  });

  const editionClasses = classes?.filter(
    (class_) => class_.editionId === candidate.editionId,
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      toast.loading(t("OnSubmitLoading"), { id: "1" });

      const response = await createStudent({
        data: {
          candidateId: candidate.id,
          classId: values.classId,
        },
      });

      if (response?.status === 201) {
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("AssignClass")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue
                      placeholder={t("ClassesList.InputPlaceHolder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isPending ? (
                    <p>{t("ClassesList.Loading")}</p>
                  ) : !classes ? (
                    <p>{t("ClassesList.NoClassesFound")}</p>
                  ) : (
                    editionClasses?.map((class_) => (
                      <SelectItem key={class_.id} value={class_.id}>
                        {t(`ClassShift.${class_.shift}`)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} className="ml-auto mt-3 rounded-xl">
          {t("SubmitButton")}
        </Button>
      </form>
    </Form>
  );
}
