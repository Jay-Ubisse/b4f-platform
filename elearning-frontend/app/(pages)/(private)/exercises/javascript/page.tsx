"use client";

import { ChevronRightIcon, PlusCircle } from "lucide-react";
import Link from "next/link";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/loading-spinner";
import { getExercises } from "@/services/exercise";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/app/types/user";

export default function ExercisesPage() {
  const { user } = useAuth();

  const {
    isPending,
    error,
    data: exercises,
    refetch,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
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
          <h1 className="text-2xl font-bold text-primary">
            Exercícios JavaScript
          </h1>
          {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
            <Link href="/exercises/javascript/create">
              <Button
                size={"sm"}
                className="bg-primary text-white flex items-center gap-2"
              >
                <PlusCircle size={18} /> Novo exercício
              </Button>
            </Link>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
          <p>Ocorreu um erro ao carregar Exercícios JavaScript</p>
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

  if (!exercises || exercises.length < 1) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">
            Exercícios JavaScript
          </h1>
          {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
            <Link href="/exercises/javascript/create">
              <Button
                size={"sm"}
                className="bg-primary text-white flex items-center gap-2"
              >
                <PlusCircle size={18} /> Novo exercício
              </Button>
            </Link>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-yellow-500/80">
          <p>Nenhum exercício encontrado</p>
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

  const javascriptExercises = exercises.filter(
    (exercise) => exercise.language === "JAVASCRIPT"
  );

  return (
    <div className="flex w-full max-w-lg mx-auto flex-col gap-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Exercícios JavaScript</h1>
        {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
          <Link href="/exercises/javascript/create">
            <Button
              size={"sm"}
              className="bg-primary text-white flex items-center gap-2"
            >
              <PlusCircle size={18} /> Novo exercício
            </Button>
          </Link>
        ) : (
          ""
        )}
      </div>
      {javascriptExercises.map((exercise) => (
        <Item key={exercise.id} variant="outline" size="sm" asChild>
          <Link href={`/exercises/javascript/${exercise.id}`}>
            <ItemContent>
              <ItemTitle className="text-base line-clamp-1">
                {exercise.title}
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>
      ))}
    </div>
  );
}
