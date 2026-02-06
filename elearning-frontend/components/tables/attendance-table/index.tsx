"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AttendanceProps, AttendanceStatus } from "@/app/types/attendance";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil } from "lucide-react";
import clsx from "clsx";

interface Props {
  attendance: AttendanceProps[];
  onHandleStudentPresence: (
    studentId: string,
    date: string,
    status: AttendanceStatus.PRESENT | AttendanceStatus.ABSENT
  ) => void;
  onInitializeAttendance: (date: string) => void;
  loadingMap: { [key: string]: boolean };
}

export function AttendanceTable({
  attendance,
  onHandleStudentPresence,
  onInitializeAttendance,
  loadingMap,
}: Props) {
  const students = Array.from(
    new Map(attendance.map((a) => [a.student.id, a.student])).values()
  );

  // Lista de datas únicas (colunas), inicializada a partir dos dados
  const [dates, setDates] = useState<string[]>(
    Array.from(new Set(attendance.map((a) => a.date.slice(0, 10)))).sort()
  );

  const getStatus = (studentId: string, date: string) => {
    const record = attendance.find(
      (a) => a.student.id === studentId && a.date.startsWith(date)
    );
    return record?.status || null;
  };

  /*  const handleAddDate = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (!dates.includes(today)) {
      setDates([...dates, today]);
    }
  }; */

  const handleDeleteDate = (date: string) => {
    setDates((prev) => prev.filter((d) => d !== date));
  };

  const handleEditDate = (oldDate: string, newDate: string) => {
    if (!newDate || newDate === oldDate) return;
    setDates((prev) => prev.map((d) => (d === oldDate ? newDate : d)).sort());
  };

  return (
    <div className="overflow-auto border rounded-lg shadow mt-10">
      <table className="min-w-full text-sm text-center">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="p-2 text-left bg-secondary sticky left-0 z-20">
              Estudante
            </th>
            {dates.map((date) => (
              <th
                key={date}
                className="p-2 bg-secondary whitespace-nowrap relative group"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="font-semibold hover:underline">
                      {format(parseISO(date), "dd/MM", { locale: ptBR })}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="space-y-2 p-3 w-44">
                    <EditDatePopover
                      date={date}
                      onEdit={handleEditDate}
                      onDelete={handleDeleteDate}
                    />
                  </PopoverContent>
                </Popover>
              </th>
            ))}
            <th className="p-2 bg-secondary">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    ➕ Adicionar data
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit space-y-2 p-3">
                  <AddDateForm
                    dates={dates}
                    onAdd={(newDate) => {
                      if (!dates.includes(newDate)) {
                        onInitializeAttendance(newDate);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </th>

            <th className="p-2 bg-secondary sticky right-0 z-10">Presenças</th>
            <th className="p-2 bg-secondary sticky right-0 z-10">Faltas</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            let totalPresences = 0;
            let totalAbsences = 0;

            return (
              <tr key={student.id} className="border-t">
                <td className="p-2 text-left bg-secondary sticky left-0 z-10">
                  {student.name}
                </td>
                {dates.map((date) => {
                  const status = getStatus(student.id, date);
                  const key = `${student.id}_${date}`;

                  if (status === "PRESENT") totalPresences++;
                  if (status === "ABSENT") totalAbsences++;

                  return (
                    <td key={date} className="p-2">
                      {status ? (
                        <span
                          className={clsx(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            status === "PRESENT" &&
                              "bg-green-100 text-green-800",
                            status === "ABSENT" && "bg-red-100 text-red-800"
                          )}
                        >
                          {status}
                        </span>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 text-xs hover:text-black"
                              disabled={loadingMap[key]}
                            >
                              {loadingMap[key] ? "..." : "+"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-fit p-2 text-xs">
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-green-700"
                                disabled={loadingMap[key]}
                                onClick={() =>
                                  onHandleStudentPresence(
                                    student.id,
                                    date,
                                    AttendanceStatus.PRESENT
                                  )
                                }
                              >
                                ✅ Presente
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-red-700"
                                disabled={loadingMap[key]}
                                onClick={() =>
                                  onHandleStudentPresence(
                                    student.id,
                                    date,
                                    AttendanceStatus.ABSENT
                                  )
                                }
                              >
                                ❌ Ausente
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </td>
                  );
                })}
                <td className="p-2">—</td>
                <td className="p-2 bg-white sticky right-0 z-10 text-green-700 font-semibold">
                  {totalPresences}
                </td>
                <td className="p-2 bg-white sticky right-0 z-10 text-red-700 font-semibold">
                  {totalAbsences}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Subcomponente para editar/remover data
function EditDatePopover({
  date,
  onEdit,
  onDelete,
}: {
  date: string;
  onEdit: (oldDate: string, newDate: string) => void;
  onDelete: (date: string) => void;
}) {
  const [newDate, setNewDate] = useState(date);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium block">Editar data</label>
      <Input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <div className="flex justify-between gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(date, newDate)}
          className="text-blue-600 flex-1"
        >
          <Pencil className="w-4 h-4 mr-1" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(date)}
          className="flex-1"
        >
          <Trash2 className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
}

function AddDateForm({
  dates,
  onAdd,
}: {
  dates: string[];
  onAdd: (newDate: string) => void;
}) {
  const [newDate, setNewDate] = useState("");

  const handleAdd = () => {
    if (!newDate) return;
    if (!dates.includes(newDate)) {
      onAdd(newDate);
      setNewDate(""); // limpa o campo
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <label className="block font-medium">Nova data</label>
      <Input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="text-sm"
      />
      <Button
        size="sm"
        className="w-full"
        onClick={handleAdd}
        disabled={!newDate || dates.includes(newDate)}
      >
        Adicionar
      </Button>
    </div>
  );
}
