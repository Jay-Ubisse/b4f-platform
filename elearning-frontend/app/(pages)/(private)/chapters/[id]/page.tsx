"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/loading-spinner";
import { getChapter } from "@/services/chapter";

import "../create/[moduleId]/editor.css";
import "../create/[moduleId]/editor-content.css";
import Link from "next/link";

export default function ChapterDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    isPending,
    error,
    data: chapter,
    refetch,
  } = useQuery({
    queryKey: ["chapter"],
    queryFn: () => getChapter(id),
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
        <p>Ocorreu um erro ao buscar capítulo</p>
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

  if (!chapter) {
    return (
      <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-yellow-500/80">
        <p>Capítulo não encontrado</p>
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

  return (
    <div>
      <h1 className="text-2xl font-semibold">{chapter.name}</h1>

      <div className="rounded-md overflow-hidden border mt-2">
        <video
          controls
          src={chapter.videoUrl}
          className="w-full h-96 object-cover"
        />
      </div>

      <div className="flex justify-between py-5 px-1">
        <p className="text-slate-500">
          Criado por
          <span className="underline underline-offset-1">
            {chapter.createdBy.name}
          </span>
        </p>
        <p className="text-slate-500">
          Data de criação:{" "}
          <span>{format(chapter.createdAt, "dd/MM/yyyy")}</span>
        </p>
      </div>

      <div className="border rounded-md p-4 bg-white">
        <div
          className="rendered-content"
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />
      </div>
      {chapter.quizzes.length > 0 ? (
        <Link
          href={`/quizzes/${chapter.quizzes[0].id}`}
          className="mt-8 w-fit block mx-auto"
        >
          <Button>Iniciar Quizz</Button>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
