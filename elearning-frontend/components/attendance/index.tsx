"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CirclePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { AttendanceTable } from "../tables/attendance-table";
import { AttendanceStatus } from "@/app/types/attendance";
import { useEdition } from "@/contexts/edition-context";
import { Icons } from "../loading-spinner";
import {
  managePresence,
  getAttendanceByEdition,
  initializeAttendance,
} from "@/services/attendance";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/app/types/user";

export function Attendance() {
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { edition } = useEdition();
  const { user } = useAuth();

  const {
    isPending,
    error,
    data: attendance,
    refetch,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => getAttendanceByEdition({ editionId: edition?.id }),
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
        <p>Ocorreu um erro ao carregar Precenças</p>
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

  if (!attendance || attendance.length === 0 || attendance.length < 0) {
    return (
      <div className="h-[500px] flex justify-center items-center">
        {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="default"
                variant="default"
                className="flex gap-2 hover:bg-primary hover:cursor-pointer"
              >
                <CirclePlus size={20} />
                <span>Criar Lista de Presenças</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-fit space-y-3 p-3">
              <div className="space-y-2 text-xs">
                <label className="block font-medium">Data de início</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <label className="block font-medium">Data de fim</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />

                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleInitializeAttendanceRange()}
                >
                  Criar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <p>Lista de presenças não disponíveil</p>
        )}
      </div>
    );
  }

  async function handleInitializeAttendanceRange() {
    if (!startDate || !endDate) {
      toast.error("Selecione as duas datas");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Data de início não pode ser maior que a de fim");
      return;
    }

    try {
      toast.loading("A processar...", { id: "range" });

      const response = await initializeAttendance({
        data: {
          editionId: edition?.id,
          startDate,
          endDate,
        },
      });

      if (response.status === 201) {
        toast.success("Presenças criadas para o intervalo!", { id: "range" });
        refetch();
      } else {
        toast.error(response.data.message, { id: "range" });
      }
    } catch (err) {
      console.log(err);
      toast.error("Falha ao criar presenças", { id: "range" });
    }
  }

  async function handleStudentPresence(
    studentId: string,
    date: string,
    status: AttendanceStatus
  ) {
    const key = `${studentId}_${date}`;
    setLoadingMap((prev) => ({ ...prev, [key]: true }));
    console.log(studentId, status, date);
    toast.loading("A processar...", { id: "1" });
    try {
      const response = await managePresence({
        data: {
          date,
          status,
          studentId,
          editionId: edition?.id,
        },
      });

      if (response.status === 200) {
        toast.success("Presença registrada com sucesso!", { id: "1" });
      } else {
        toast.error("Ocorreu um erro ao registrar presença.", { id: "1" });
      }
    } catch (err) {
      console.log(err);
      toast.error("Erro ao registrar presença");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    }
  }

  return (
    <AttendanceTable
      attendance={attendance}
      onHandleStudentPresence={handleStudentPresence}
      onInitializeAttendance={handleInitializeAttendanceRange}
      loadingMap={loadingMap}
    />
  );
}
