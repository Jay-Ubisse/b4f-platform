"use client";

import { useQuery } from "@tanstack/react-query";
import { CirclePlus, Users as UsersIcon, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { _Translator as Translate } from "next-intl";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUsers } from "@/services/users";
import { DataTable } from "./data-table";
import { useUserColumns } from "./columns";
import { useAuth } from "@/contexts/auth-context";
import { useTranslations } from "next-intl";
import { UserProps, UserRole } from "@/app/types/user";
import { cn } from "@/lib/utils";

export const UsersTable = () => {
  const { user } = useAuth();
  const t = useTranslations("Dashboard.UsersPage");

  const columns = useUserColumns();

  const {
    isPending,
    error,
    data: users,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    refetchInterval: 5000,
  });

  const nonStudentUsers =
    users?.filter(
      (u) => u.role !== UserRole.STUDENT && u.role !== UserRole.ALUMNI,
    ) ?? [];

  return (
    <div className="p-4 md:p-10">
      <HeaderActions user={user} t={t} count={nonStudentUsers.length} />

      {isPending ? (
        <StateCard
          variant="loading"
          title={t("Loading")}
          description={t("Loading")}
        >
          <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
        </StateCard>
      ) : error ? (
        <StateCard
          variant="error"
          title={t("Error")}
          description={t("Error")}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={refetch as unknown as () => void}
              className="gap-2"
            >
              <RefreshCcw className="size-4" />
              {t("Refresh")}
            </Button>
          }
        />
      ) : !users || nonStudentUsers.length === 0 ? (
        <StateCard
          variant="empty"
          title={t("NoUsersFound")}
          description={t("NoUsersFound")}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={refetch as unknown as () => void}
              className="gap-2"
            >
              <RefreshCcw className="size-4" />
              {t("Refresh")}
            </Button>
          }
        />
      ) : (
        <div className="mt-6">
          <Card
            className="
              overflow-hidden border-border
              bg-background/70 supports-[backdrop-filter]:bg-background/55
              supports-[backdrop-filter]:backdrop-blur-xl
              shadow-xl
            "
          >
            <div className="p-4 md:p-6">
              <DataTable columns={columns} data={nonStudentUsers} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

function HeaderActions({
  user,
  t,
  count,
}: {
  user: UserProps | null;
  t: Translate;
  count: number;
}) {
  return (
    <div className="mt-2 md:mt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-accent" />
            {t("HeaderActions.Badge")}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
                inline-flex size-10 items-center justify-center rounded-xl
                bg-gradient-to-br from-primary to-secondary
                text-primary-foreground shadow-sm ring-1 ring-white/10
              "
            >
              <UsersIcon className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("PageTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {count}{" "}
                {count === 1
                  ? t("HeaderActions.User")
                  : t("HeaderActions.Users")}
              </p>
            </div>
          </div>
        </div>

        {user?.role === "ADMIN" && (
          <Link href="/dashboard/users/create" className="w-full sm:w-auto">
            <Button
              className={cn(
                "h-11 w-full sm:w-auto rounded-xl px-4",
                "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
                "shadow-md hover:shadow-lg transition",
              )}
            >
              <CirclePlus className="mr-2 size-5" />
              <span className="font-medium">{t("NewUserButton")}</span>
            </Button>
          </Link>
        )}
      </div>

      {/* subtle divider glow */}
      <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/20 via-border to-accent/20" />
    </div>
  );
}

function StateCard({
  variant,
  title,
  description,
  action,
  children,
}: {
  variant: "loading" | "error" | "empty";
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const styles =
    variant === "error"
      ? "from-destructive/15 to-destructive/5"
      : variant === "empty"
        ? "from-accent/15 to-primary/10"
        : "from-primary/15 to-accent/10";

  return (
    <Card
      className="
        mt-8 overflow-hidden border-border
        bg-background/70 supports-[backdrop-filter]:bg-background/55
        supports-[backdrop-filter]:backdrop-blur-xl
        shadow-xl
      "
    >
      <div className={cn("p-6 md:p-8 bg-gradient-to-r", styles)}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-lg font-semibold">{title}</p>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {action}
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
