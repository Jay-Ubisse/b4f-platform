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
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { InterviewProps, InterviewStatus } from "@/app/types/interview";
import { EndInterviewForm } from "@/components/forms/end-interview";
import { statusStyleGenerator } from "@/lib/status-style-generator";
import { CreateStudentForm } from "@/components/forms/create-student";
import { Button } from "@/components/ui/button";

export default function InterviewDetailsCard({
  interview,
}: {
  interview: InterviewProps;
}) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard.InterviewDetailsPage");

  const isDashboard = pathname?.includes("dashboard");

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-4 text-accent" />
              {t("Badge")}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {interview.candidate.name}
            </h1>

            <p className="text-sm text-muted-foreground">{t("Subtitle")}</p>
          </div>
        </div>
      </div>

      {/* CONTENT CARD */}
      <Card className="rounded-2xl border border-primary/15 bg-background/60 p-5 sm:p-6">
        {/* INFO GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-primary/10 bg-muted/20 p-4 space-y-3">
            <InfoItem
              icon={<Envelope size={18} weight="light" />}
              label={"Email"}
              text={interview.candidate.email}
            />
            <InfoItem
              icon={<Phone size={18} weight="light" />}
              label={t("Labels.PhoneLabel")}
              text={interview.candidate.phone}
            />
            <InfoItem
              icon={<WhatsappLogo size={18} weight="light" />}
              label={"WhatsApp"}
              text={interview.candidate.whatsapp || "-"}
            />
          </div>

          <div className="rounded-2xl border border-primary/10 bg-muted/20 p-4 space-y-3">
            <InfoItem
              icon={<MapPinLine size={18} weight="light" />}
              label={t("Labels.LocationLabel")}
              text={interview.edition.location.name}
            />
            <InfoItem
              icon={<ClockUser size={18} weight="light" />}
              label={t("Labels.AgeLabel")}
              text={`${differenceInYears(
                new Date(),
                new Date(interview.candidate.birthDate),
              )} ${t("Labels.YearsOld")}`}
            />
            <InfoItem
              icon={<Video size={18} weight="light" />}
              label={t("Labels.CourseLabel")}
              text={interview.edition.course.name}
            />
          </div>

          <div className="rounded-2xl border border-primary/10 bg-muted/20 p-4 space-y-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {t("InterviewStatusLabel")}
              </p>
              <div className="mt-1">
                <span className={statusStyleGenerator(interview.status)}>
                  {t(`InterviewStatus.${interview.status}`)}
                </span>
              </div>
            </div>

            {interview.status === InterviewStatus.FINISHED && (
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {t("InterviewResultLabel")}
                </p>
                <div className="mt-1">
                  <span
                    className={statusStyleGenerator(interview.candidate.status)}
                  >
                    {t(`InterviewResult.${interview.candidate.status}`)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* MOTIVATION */}
        <section className="mt-6 rounded-2xl border border-primary/10 bg-muted/20 p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            {t("Motivation")}
          </h3>
          <p className="text-sm sm:text-base text-justify">
            {interview.candidate.motivation}
          </p>
        </section>

        {/* END INTERVIEW */}
        {isDashboard && interview.status !== InterviewStatus.FINISHED && (
          <section className="mt-6 rounded-2xl border border-primary/10 bg-muted/20 p-4">
            <EndInterviewForm interviewId={interview.id} />
          </section>
        )}

        {/* OBSERVATIONS + STUDENT */}
        {isDashboard && interview.status === InterviewStatus.FINISHED && (
          <div className="mt-6 space-y-6">
            <section className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {t("InterviewObservations")}
              </h3>

              <p className="text-sm sm:text-base text-justify">
                {interview.observations || "-"}
              </p>

              {interview.interviewGuideUrl && (
                <div className="mt-4">
                  <Link href={interview.interviewGuideUrl} target="_blank">
                    <Button variant="outline" className="rounded-xl">
                      {t("ViewInterviewGuide")}
                    </Button>
                  </Link>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-primary/10 bg-muted/20 p-4">
              <CreateStudentForm candidate={interview.candidate} />
            </section>
          </div>
        )}
      </Card>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Icon: tamanho fixo sempre */}
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground ring-1 ring-white/10">
        {icon}
      </span>

      {/* Text: reticências */}
      <div className="min-w-0 leading-tight">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{text}</p>
      </div>
    </div>
  );
}
