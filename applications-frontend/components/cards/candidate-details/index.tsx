"use client";

import {
  ClockUser,
  Envelope,
  MapPinLine,
  Phone,
  Video,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { differenceInYears } from "date-fns";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { CandidateProps, CandidateStatus } from "@/app/types/candidates";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { statusStyleGenerator } from "@/lib/status-style-generator";
import { useEdition } from "@/contexts/edition-contentx";
import { Button } from "@/components/ui/button";
import { scheduleInterview } from "@/services/interviews";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-2">
      <span
        className="
          inline-flex size-9 shrink-0 items-center justify-center rounded-xl
          bg-gradient-to-br from-primary to-secondary
          text-primary-foreground ring-1 ring-white/10
        "
      >
        {icon}
      </span>

      <div className="min-w-0 leading-tight">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

export default function CandidateDetailsCard({
  candidate,
}: {
  candidate: CandidateProps;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { edition } = useEdition();
  const pathname = usePathname();
  const t = useTranslations("Public.CandidateDetailsPage");

  const isDashboard = pathname?.includes("dashboard");
  const shouldShowInterviewSection =
    candidate.status === CandidateStatus.PENDING && !isDashboard;

  const age = useMemo(() => {
    const birth = new Date(candidate.birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    return differenceInYears(new Date(), birth);
  }, [candidate.birthDate]);

  async function handleInterviewSchedule() {
    try {
      setIsLoading(true);
      toast.loading(t("Loading"), { id: "1" });

      const response = await scheduleInterview({
        data: {
          candidateId: candidate.id,
          editionId: candidate.edition.id,
        },
      });

      if (response?.status === 201) toast.success(t("Success"), { id: "1" });
      else toast.error(t("Error"), { id: "1" });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(t("Error"), { id: "1" });
      setIsLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-primary/15">
      <CardHeader className="border-b border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-4 text-accent" />
              {candidate.edition?.course?.name
                ? `${t("Badge")}: ${candidate.edition.course.name}`
                : "Candidato"}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight truncate">
              {candidate.name}
            </h1>

            <div className="mt-2">
              <span
                className={cn(
                  statusStyleGenerator(candidate.status),
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                )}
              >
                {t("ApplicationStatusLabel")}:{" "}
                {t(`ApplicationStatus.${candidate.status}`)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8">
        {/* GRID INFO */}
        <div className="grid gap-3 md:grid-cols-3">
          <InfoRow
            icon={<Envelope size={18} weight="bold" />}
            label="Email"
            value={candidate.email}
          />
          <InfoRow
            icon={<Phone size={18} weight="bold" />}
            label={t("Labels.PhoneLabel") ?? "Telefone"}
            value={candidate.phone}
          />
          <InfoRow
            icon={<WhatsappLogo size={18} weight="bold" />}
            label="WhatsApp"
            value={candidate.whatsapp || "-"}
          />

          <InfoRow
            icon={<MapPinLine size={18} weight="bold" />}
            label={t("Labels.LocationLabel") ?? "Local"}
            value={candidate.edition.location.name}
          />
          <InfoRow
            icon={<ClockUser size={18} weight="bold" />}
            label={t("Labels.AgeLabel") ?? "Idade"}
            value={age === null ? "-" : `${age} ${t("YearsOld")}`}
          />
          <InfoRow
            icon={<Video size={18} weight="bold" />}
            label={t("Labels.CourseLabel") ?? "Curso"}
            value={candidate.edition.course.name}
          />
        </div>

        {/* MOTIVATION */}
        <section className="mt-6">
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-4 sm:p-5">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {t("Motivation")}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-justify text-foreground/90">
              {candidate.motivation}
            </p>
          </div>
        </section>

        {/* INTERVIEW SECTION */}
        {shouldShowInterviewSection && (
          <section className="mt-6 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4 sm:p-5">
            <p className="text-sm text-foreground/90">
              {t("ApplicationScheduleLink")}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <strong>NB:</strong> {t("FinshScheduleLabel")}
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-primary/15 bg-background/60 px-4 py-3">
              <Link
                href={edition?.interviewBookingUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate text-sm text-primary hover:underline"
              >
                {edition?.interviewBookingUrl}
              </Link>

              <Button
                variant="default"
                size="sm"
                disabled={isLoading}
                onClick={handleInterviewSchedule}
                className="rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-95"
              >
                {t("FinshScheduleButton")}
              </Button>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
