"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Edit, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/loading-spinner";
import { deleteModule, getModule } from "@/services/module";
import Link from "next/link";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/app/types/user";

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const { user } = useAuth();

  const {
    isPending,
    error,
    data: module,
    refetch,
  } = useQuery({
    queryKey: ["modules"],
    queryFn: () => getModule(id),
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

  if (!module) {
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
    const response = await deleteModule(id);

    if (response.status === 200) {
      toast.success("Módulo eliminado com sucesso", { id: "1" });
      router.push("/modules");
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
            src={module.bannerUrl}
            alt={module.name}
            width={800}
            height={450}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">{module.name}</h1>

          {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
            <div>
              {" "}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/modules/${module.id}/edit`)}
              >
                <Pencil className="w-5 h-5 text-muted-foreground" />
              </Button>
              <DeleteAlertDialog
                title="Tem certeza?"
                description="Esta ação não pode ser desfeita. Isso eliminará o módulo permanentemente."
                onConfirm={() => onDeleteConfirm(module.id)}
              />{" "}
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="text-sm text-muted-foreground flex gap-4">
          <span>{module.chaptersNumber} Capítulos</span>
          <span>{module.quizzesNumber} Quizzes</span>
        </div>
      </div>

      {/* Coluna Direita */}
      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            Capítulos do Módulo
          </h2>
          {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
            <Link href={`/chapters/create/${module.id}`}>
              <Button className="bg-primary text-white flex items-center gap-2">
                <PlusCircle size={18} /> Novo Capítulo
              </Button>
            </Link>
          ) : (
            ""
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {module.chapters ? (
            module.chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between"
              >
                <div>
                  <Link href={`/chapters/${chapter.id}`}>
                    <h3 className="text-base font-semibold hover:underline hover:underline-offset-1 hover:cursor-pointer">
                      {chapter.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {chapter.quizzesNumber} quizzes
                  </p>
                </div>

                {user?.role === UserRole.ADMIN ||
                user?.role === UserRole.TEACHER ? (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        router.push(`/chapters/${chapter.id}/edit`)
                      }
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => console.log("Deletar módulo", module.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  ""
                )}
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
