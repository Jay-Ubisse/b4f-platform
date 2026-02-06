"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/loading-spinner";
import { CreateModuleDialog } from "@/components/forms/create-module";
import { getModules } from "@/services/module";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/app/types/user";

export default function ModulesPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const {
    isPending,
    error,
    data: modules,
    refetch,
  } = useQuery({
    queryKey: ["modules"],
    queryFn: () => getModules(),
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
          <h1 className="text-2xl font-bold text-primary">Módulos</h1>
          {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
            <CreateModuleDialog />
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
          <p>Ocorreu um erro ao carregar módulos</p>
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

  if (!modules || modules.length < 1) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Módulos</h1>
          {}
          {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
            <CreateModuleDialog />
          ) : (
            ""
          )}
        </div>
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
      </div>
    );
  }

  const filteredModules = modules
    ? modules.filter((module) => {
        const term = search.toLowerCase();
        return module.name.toLowerCase().includes(term);
      })
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* Topo */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Módulos</h1>
        {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
          <CreateModuleDialog />
        ) : (
          ""
        )}
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filtros */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Filtrar</h2>
            <Input
              placeholder="Pesquisar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de módulos */}
        <div className="col-span-12 md:col-span-9">
          <ScrollArea className="h-[calc(100vh-160px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/modules/${module.id}`)}
                    className="módulor-pointer"
                  >
                    <Card className="overflow-hidden rounded-2xl shadow-md border pt-0 border-gray-200">
                      <img
                        src={module.bannerUrl || "/images/default-banner.jpg"}
                        alt={module.name}
                        className="h-48 w-full object-cover"
                      />
                      <CardContent className="p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-primary">
                          {module.name}
                        </h3>
                        <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2">
                          <div>
                            <strong>{module.chaptersNumber}</strong> Capítulos
                          </div>
                          <div>
                            <strong>{module.quizzesNumber}</strong> Quizzes
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <p className="bg-slate-100 rounded-md px-4 py-2">
                    Nenhum módulo encontrado
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
