"use client";

import * as React from "react";
import { Check, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routing } from "@/i18n/routing";
import { Locale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  defaultValue: string;
  label: string;
  className?: string;
};

export default function LanguageSwitcherSelect({
  defaultValue,
  label,
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(nextLocale: string) {
    console.log(nextLocale);
    router.replace(
      // @ts-expect-error next-intl typed routing
      { pathname, params },
      { locale: nextLocale as Locale },
    );
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          [
            // layout
            "mx-auto h-9 w-[96px] rounded-xl px-3",
            "flex items-center gap-2",

            // base tokens
            "border border-border bg-card/60 text-foreground shadow-sm",
            "supports-[backdrop-filter]:bg-background/50 supports-[backdrop-filter]:backdrop-blur-xl",

            // focus/hover
            "transition",
            "hover:shadow-md hover:border-primary/30",
            "focus:ring-2 focus:ring-ring focus:ring-offset-0",

            // make it feel branded
            "relative overflow-hidden",
          ].join(" "),
          className,
        )}
      >
        {/* gradient overlay */}
        <span
          className="
            pointer-events-none absolute inset-0 opacity-70
            bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/15
          "
        />
        {/* subtle shine */}
        <span
          className="
            pointer-events-none absolute -right-10 top-0 h-full w-24 rotate-12
            bg-white/10 opacity-0 transition group-hover:opacity-100
          "
        />

        <span className="relative inline-flex items-center gap-2">
          <span
            className="
              inline-flex size-7 items-center justify-center rounded-lg
              text-primary-foreground
              bg-gradient-to-br from-primary to-secondary
              ring-1 ring-white/10
            "
          >
            <Languages className="size-4 text-primary-foreground" />
          </span>

          <span className="relative">
            <SelectValue className="text-foreground" />
          </span>
        </span>
      </SelectTrigger>

      <SelectContent
        className="
          rounded-xl border border-border
          bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl
          shadow-xl
        "
      >
        {routing.locales.map((locale) => {
          const isActive = defaultValue === locale;

          return (
            <SelectItem
              key={locale}
              value={locale}
              className="
                rounded-lg cursor-pointer text-foreground
                focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10
              "
            >
              <div className="flex w-full items-center justify-between gap-3">
                <span className="font-medium">{locale.toUpperCase()}</span>

                {isActive ? (
                  <span
                    className="
                      inline-flex items-center gap-1 text-xs
                      text-foreground/80
                    "
                  >
                    <Check className="size-4 text-accent" />
                  </span>
                ) : (
                  <span
                    className="
                      text-[10px] px-2 py-1 rounded-full
                      border border-primary/15
                      bg-gradient-to-r from-primary/10 to-secondary/10
                      text-muted-foreground
                    "
                  >
                    Select
                  </span>
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
