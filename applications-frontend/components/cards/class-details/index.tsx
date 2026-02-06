"use client";

import { Trash2, Users, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClassProps } from "@/app/types/class";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ClassDetailsCard({ class_ }: { class_: ClassProps }) {
  const t = useTranslations("Dashboard.ClassDetailsPage");

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <div className="max-w-6xl mx-auto mt-10">
        <Card className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5">
          <div className="flex flex-col gap-4">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-4 text-accent" />
              {class_.edition?.name} • {class_.edition?.location?.name}
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("Title", { shift: t(`Shifts.${class_.shift}`) })}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                {class_.edition?.course?.name}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <Users className="size-4" />
                {t("StudentsEnrolled") ?? "Inscritos"}:{" "}
                <span className="text-foreground font-medium">
                  {class_.students.length}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                {t("ClassCapacity") ?? "Capacidade"}:{" "}
                <span className="text-foreground font-medium">
                  {class_.capacity}
                </span>
              </span>
            </div>
          </div>
        </Card>

        {/* Students list */}
        <Card className="mt-6 rounded-2xl border border-primary/15 bg-background/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">
                {t("Students") ?? "Estudantes"}
              </h2>
              <p className="text-sm text-muted-foreground">{t("Subtitle")}</p>
            </div>
          </div>

          <div className="mt-4">
            <ScrollArea className="h-72 rounded-xl border border-primary/10 bg-background/40">
              <div className="p-4">
                {class_.students.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("NoStudentsEnrolled") ??
                        "Nenhum estudante matriculado"}
                    </p>
                  </div>
                ) : (
                  class_.students.map((student) => (
                    <div key={student.id} className="py-2">
                      <div className="flex items-center justify-between gap-3">
                        {/* name truncates, keeps icon fixed */}
                        <p className="text-sm font-medium truncate min-w-0">
                          {student.name}
                        </p>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 rounded-xl"
                          onClick={() => {
                            // TODO: ligar ao dialog/handler de delete
                            console.log("delete student:", student.id);
                          }}
                          aria-label={
                            t("DeleteStudent") ?? "Eliminar estudante"
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <Separator className="mt-3" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("StudentsEnrolled") ?? "Inscritos"}:
            </span>{" "}
            {class_.students.length}{" "}
            <span className="lowercase">{t("Students") ?? "estudantes"}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
