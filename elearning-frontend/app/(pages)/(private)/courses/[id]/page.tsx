"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/loading-spinner";
import { deleteCourse, getCourse } from "@/services/course";
import { CreateModuleDialog } from "@/components/forms/create-module";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
import toast from "react-hot-toast";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const {
    isPending,
    error,
    data: course,
    refetch,
  } = useQuery({
    queryKey: ["course"],
    queryFn: () => getCourse(id),
    refetchInterval: 5000,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center px-4 py-2 w-full h-full">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
        <p>Ocorreu um erro ao carregar módulo</p>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            refetch();
          }}
        >
          Recarregar
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-yellow-500/80">
        <p>Nenhum módulo encontrado</p>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            refetch();
          }}
        >
          Recarregar
        </Button>
      </div>
    );
  }

  const onDeleteConfirm = async (id: string) => {
    const response = await deleteCourse(id);

    if (response.status === 200) {
      toast.success("Curso eliminado com sucesso", { id: "1" });
      router.push("/courses");
    } else {
      toast.error(response.data.message, { id: "1" });
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna Esquerda */}
      <div className="col-span-1 space-y-4">
        <div className="rounded-2xl overflow-hidden w-full aspect-[16/9] bg-muted">
          <Image
            src={course.bannerUrl}
            alt={course.name}
            width={800}
            height={450}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">{course.name}</h1>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/courses/${course.id}/edit`)}
            >
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </Button>
            <DeleteAlertDialog
              title="Tem certeza?"
              description="Esta ação não pode ser desfeita. Isso eliminará o curso permanentemente."
              onConfirm={() => onDeleteConfirm(course.id)}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground flex gap-4">
          <span>{course.modulesNumber} Módulos</span>
          <span>{course.chaptersNumber} Capítulos</span>
          <span>{course.quizzesNumber} Quizzes</span>
        </div>
      </div>

      {/* Coluna Direita */}
      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            Módulos do curso
          </h2>
          <CreateModuleDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.modules ? (
            course.modules.map((module) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3
                    className="text-base font-semibold hover:cursor-pointer hover:underline hover:underline-offset-1"
                    onClick={() => router.push(`/modules/${module.id}`)}
                  >
                    {module.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {module.chaptersNumber} capítulos • {module.quizzesNumber}{" "}
                    quizzes
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => router.push(`/courses/${course.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => console.log("Deletar módulo", course.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
