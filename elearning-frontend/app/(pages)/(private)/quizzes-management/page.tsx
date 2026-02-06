"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Icons } from "@/components/loading-spinner";

import { getQuizzes } from "@/services/quizz";
import { getModules } from "@/services/module";
import { getUsers } from "@/services/user";
import CreateQuizzDialog from "@/components/forms/create-quizz";
import { DeleteQuizButton } from "./components/delete-quizz-dialog";

export default function QuizzesPage() {
  const router = useRouter();

  // filtros
  const [search, setSearch] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [authorId, setAuthorId] = useState("");

  // fetch all quizzes once
  const quizzesQuery = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => getQuizzes(),
    refetchInterval: 5000,
  });

  const modulesQuery = useQuery({
    queryKey: ["modules"],
    queryFn: () => getModules(),
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const quizzes = quizzesQuery.data || [];
  const modules = modulesQuery.data || [];
  const users = usersQuery.data || [];

  // -----------------------------
  // 📌 FILTRAGEM "ON THE FLY"
  // -----------------------------
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const searchTerm = search.toLowerCase();

      const matchSearch =
        q.name.toLowerCase().includes(searchTerm) ||
        q.chapter.name.toLowerCase().includes(searchTerm) ||
        q.chapter.module.name.toLowerCase().includes(searchTerm) ||
        q.createdBy.name.toLowerCase().includes(searchTerm);

      const matchModule = moduleId ? q.chapter.moduleId === moduleId : true;
      const matchChapter = chapterId ? q.chapterId === chapterId : true;
      const matchAuthor = authorId ? q.createdById === authorId : true;

      return matchSearch && matchModule && matchChapter && matchAuthor;
    });
  }, [quizzes, search, moduleId, chapterId, authorId]);

  // capítulos dependentes do módulo selecionado
  const chaptersForSelectedModule = useMemo(() => {
    const mod = modules.find((m) => m.id === moduleId);
    return mod ? mod.chapters : [];
  }, [moduleId, modules]);

  if (
    quizzesQuery.isPending ||
    modulesQuery.isPending ||
    usersQuery.isPending
  ) {
    return (
      <div className="flex justify-center items-center px-4 py-2 w-full h-full">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!quizzes.length || !modules.length || !users.length) {
    return (
      <div>
        <div className="flex items-center w-full justify-between mt-10 px-10">
          <h1 className="text-2xl font-bold text-primary">Gestão de Quizzes</h1>

          <CreateQuizzDialog modules={modules} />
        </div>
        <div className="flex justify-center items-center w-full h-full mt-20">
          <p>Nenhum quiz encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Topo */}
      <div className="flex items-center w-full justify-between">
        <h1 className="text-2xl font-bold text-primary">Gestão de Quizzes</h1>

        <CreateQuizzDialog modules={modules} />
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filtros */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-2xl shadow p-4 space-y-4">
            <h2 className="text-lg font-semibold">Filtrar</h2>

            {/* Busca */}
            <Input
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Módulo */}
            <select
              className="w-full bg-white border p-2 rounded-lg"
              value={moduleId}
              onChange={(e) => {
                setModuleId(e.target.value);
                setChapterId("");
              }}
            >
              <option value="">Todos módulos</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* Capítulo */}
            <select
              className="w-full bg-white border p-2 rounded-lg"
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              disabled={!moduleId}
            >
              <option value="">Todos capítulos</option>
              {chaptersForSelectedModule.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Autor */}
            <select
              className="w-full bg-white border p-2 rounded-lg"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
            >
              <option value="">Todos autores</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de quizzes */}
        <div className="col-span-12 md:col-span-9">
          <ScrollArea className="h-[calc(100vh-160px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((q) => (
                  <motion.div
                    key={q.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      // Se o clique veio de um botão → não navega
                      if ((e.target as HTMLElement).closest("button")) return;

                      router.push(`/quizzes/${q.id}`);
                    }}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden rounded-2xl shadow-md border border-gray-200">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-primary">
                            {q.name}
                          </h3>

                          <div className="flex items-center gap-3">
                            {/* Botão Editar */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/quizzes/${q.id}/edit`);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 
                   6.34c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 
                   0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                />
                              </svg>
                            </motion.button>

                            {/* Botão Eliminar (abre diálogo) */}
                            <DeleteQuizButton quizId={q.id} quizName={q.name} />
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Módulo: {q.chapter.module.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Capítulo: {q.chapter.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Autor: {q.createdBy.name}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="bg-slate-100 rounded-md px-4 py-2">
                    Nenhum quiz encontrado
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
