"use client";

import { useQuery } from "@tanstack/react-query";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getStudentsByEdition } from "@/services/student";
import { useEdition } from "@/contexts/edition-context";

export const StudentsTable = () => {
  const { edition } = useEdition();

  const {
    isPending,
    error,
    data: students,
    refetch,
  } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudentsByEdition({ editionId: edition!.id }),
    refetchInterval: 5000,
  });

  if (isPending) {
    return (
      <div className="flex justify-center h-[400px] items-center px-4 py-2 w-full">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="flex justify-between items-center my-5">
          <h1 className="text-center text-2xl font-semibold text-primary">
            Alunos
          </h1>
        </div>
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
          <p>Ocorreu um erro ao carregar usuários</p>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={refetch as unknown as () => void}
          >
            Recarregar
          </Button>
        </div>
      </div>
    );
  }

  if (!students || students.length === 0 || students.length < 0) {
    return (
      <div className="p-10">
        <div className="flex justify-between items-center my-5">
          <h1 className="text-2xl font-semibold text-primary">Alunos</h1>
        </div>
        <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-yellow-500/80">
          <p>Nenhum aluno encontrado</p>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={refetch as unknown as () => void}
          >
            Recarregar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <h1 className="text-center text-2xl font-semibold text-primary">
          Alunos
        </h1>
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={students} />
      </div>
    </div>
  );
};
