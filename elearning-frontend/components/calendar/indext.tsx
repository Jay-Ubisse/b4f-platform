"use client";

import { useQuery } from "@tanstack/react-query";
import { useEdition } from "@/contexts/edition-context";
import { getCalendarByEdition } from "@/services/calendar";
import { Icons } from "../loading-spinner";
import { Button } from "../ui/button";
import { PublishCalendarDialog } from "./publish-calendar-dialog";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/app/types/user";

export function Calendar() {
  const { edition } = useEdition();
  const { user } = useAuth();

  const {
    isPending,
    error,
    data: calendar,
    refetch,
  } = useQuery({
    queryKey: ["calendars"],
    queryFn: () => getCalendarByEdition({ editionId: edition?.id }),
  });

  if (isPending) {
    return (
      <div className="flex justify-center h-[400px] items-center px-4 py-2 w-full">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
      <p>Ocorreu um erro ao carregar usuários</p>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => {
          refetch();
        }}
      >
        Recarregar
      </Button>
    </div>;
  }

  if (!calendar) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        {user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER ? (
          <PublishCalendarDialog />
        ) : (
          <p>Calendário não publicado.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <iframe
        src={calendar.calendarUrl}
        className="w-full h-[80vh] border rounded"
      />

      <Button asChild>
        <Link href={calendar.calendarUrl} download>
          Baixar PDF
        </Link>
      </Button>
    </div>
  );
}
