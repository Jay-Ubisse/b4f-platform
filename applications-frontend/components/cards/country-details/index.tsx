"use client";

import { useMemo } from "react";
import { Trash2, MapPin, Globe2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CountryProps } from "@/app/types/country";
import { NewLocationSheet } from "@/components/sheets/new-location-sheet";
import { EditLocationSheet } from "@/components/sheets/edit-location-sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteLocation } from "@/services/location";

export function CountryDetailsCard({
  country,
  className,
}: {
  country: CountryProps;
  className?: string;
}) {
  const t = useTranslations("Dashboard.CountryDetailsPage");

  const [ConfirmDialog, confirm] = useConfirm(
    t("DeleteLocationDialog.DialogTitle"),
    t("DeleteLocationDialog.DialogDescription"),
  );

  const handleDelete = async ({ locationId }: { locationId: string }) => {
    const ok = await confirm();

    if (ok) {
      toast.loading(t("DeleteLocationDialog.OnDeleteLoading"), { id: "1" });
      const response = await deleteLocation({ id: locationId });

      if (response.status === 200) {
        toast.success(t("DeleteLocationDialog.OnDeleteSuccess"), { id: "1" });
      } else {
        toast.error(t("DeleteLocationDialog.OnDeleteError"), { id: "1" });
      }
    }
  };

  const locationsSorted = useMemo(() => {
    return [...(country.locations ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name, "pt", { sensitivity: "base" }),
    );
  }, [country.locations]);

  return (
    <div className={cn("w-full", className)}>
      <ConfirmDialog />

      <Card
        className="
          overflow-hidden border-border
          bg-background/70 supports-[backdrop-filter]:bg-background/55
          supports-[backdrop-filter]:backdrop-blur-xl
          shadow-2xl
        "
      >
        {/* Header */}
        <CardHeader className="relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/10" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="
                    inline-flex size-10 items-center justify-center rounded-xl
                    bg-gradient-to-br from-primary to-secondary
                    text-primary-foreground ring-1 ring-white/10 shadow-sm
                  "
                >
                  <Globe2 className="size-5" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-semibold tracking-tight">
                    {country.name}
                  </h1>

                  <p className="text-sm text-muted-foreground">
                    {locationsSorted.length === 1
                      ? `${locationsSorted.length} ${t("LocationsNumberLabel1")}`
                      : `${locationsSorted.length} ${t("LocationsNumberLabel2")}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <NewLocationSheet countryId={country.id} />
            </div>
          </div>

          <div className="relative mt-6 h-px w-full bg-gradient-to-r from-primary/20 via-border to-accent/20" />
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-6">
          {locationsSorted.length === 0 ? (
            <div
              className="
                rounded-xl border border-primary/15
                bg-gradient-to-r from-primary/10 to-accent/10
                p-4 text-sm text-muted-foreground
              "
            >
              {t("LocationsNotFound")}
            </div>
          ) : (
            <ul className="overflow-hidden rounded-xl border border-border">
              {locationsSorted.map((location) => (
                <li
                  key={location.id}
                  className="
                    flex items-center justify-between gap-3 px-4 py-3
                    transition
                    hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5
                    border-b last:border-b-0 border-border
                  "
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm sm:text-base font-medium">
                      {location.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <EditLocationSheet location={location} />

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      aria-label="Eliminar local"
                      className="
                        rounded-xl
                        text-destructive hover:text-destructive
                        hover:bg-destructive/10
                      "
                      onClick={() => handleDelete({ locationId: location.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
