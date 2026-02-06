"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/loading-spinner";
import {
  confirmInterview,
  getInterviewByCandidate,
} from "@/services/interviews";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { InterviewStatus } from "@/app/types/interview";

export function InterviewDate({
  candidateId,
}: {
  candidateId: string | undefined;
}) {
  const {
    isPending,
    error,
    data: interview,
  } = useQuery({
    queryKey: ["getInterview"],
    queryFn: () => getInterviewByCandidate({ candidateId }),
    refetchInterval: 5000,
  });

  const pathname = usePathname();

  if (isPending) {
    return <Icons.spinner className="size-4 animate-spin text-primary" />;
  }

  if (error) {
    return (
      <span>
        <TriangleAlert className="text-yellow-500" />
      </span>
    );
  }

  if (!interview) {
    return <span>Não marcado</span>;
  }

  async function handleInterviewConfirmation() {
    try {
      toast.loading("A confirmar entrevista", { id: "1" });
      const response = await confirmInterview({
        id: interview!.id,
      });

      if (response.status === 200) {
        toast.success(response?.data.message, { id: "1" });
      } else {
        toast.error(response.response.data.message, { id: "1" });
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao confirmar entrevista", { id: "1" });
      console.log(error);
    }
  }

  return (
    <div>
      <div>
        {format(interview.interviewDate, "dd/MM/yyyy")} -{" "}
        {format(interview.interviewDate, "HH:mm")}
      </div>
      <Button
        size={"sm"}
        className={`${pathname.includes("dashboard") || interview.status === InterviewStatus.CONFIRMED || interview.status === InterviewStatus.FINISHED ? "hidden" : "block"} text-xs mt-2 ml-auto`}
        onClick={handleInterviewConfirmation}
      >
        Confirmar Entrevista
      </Button>
    </div>
  );
}
