"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import CreateCourseDialog from "@/components/forms/create-course";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/loading-spinner";
import { getCourses } from "@/services/course";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const {
    isPending,
    error,
    data: courses,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(),
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
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Cursos</h1>
          <CreateCourseDialog />
        </div>
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
          <p>Ocorreu um erro ao carregar cursos</p>
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
      </div>
    );
  }

  if (!courses || courses.length < 1) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Cursos</h1>
          <CreateCourseDialog />
        </div>
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-yellow-500/80">
          <p>Nenhum curso encontrado</p>
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
      </div>
    );
  }

  const filteredCourses = courses
    ? courses.filter((course) => {
        const term = search.toLowerCase();
        return (
          course.name.toLowerCase().includes(term) ||
          course.tags?.toLowerCase().includes(term)
        );
      })
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* Topo */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Cursos</h1>
        <CreateCourseDialog />
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filtros */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Filtrar</h2>
            <Input
              placeholder="Pesquisar por nome ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Cursos */}
        <div className="col-span-12 md:col-span-9">
          <ScrollArea className="h-[calc(100vh-160px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden rounded-2xl shadow-md border pt-0 border-gray-200">
                      <img
                        src={course.bannerUrl || "/images/default-banner.jpg"}
                        alt={course.name}
                        className="h-48 w-full object-cover"
                      />
                      <CardContent className="p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-primary">
                          {course.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {course.tags?.split(",").map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2">
                          <div>
                            <strong>{course.modulesNumber}</strong> Módulos
                          </div>
                          <div>
                            <strong>{course.chaptersNumber}</strong> Capítulos
                          </div>
                          <div>
                            <strong>{course.quizzesNumber}</strong> Quizzes
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="bg-slate-100 rounded-md px-4 py-2">
                    Nenhum curso encontrado
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
