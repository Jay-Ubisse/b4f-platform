"use client";

import { useLocale } from "next-intl";
import LanguageSwitcherSelect from "./language-switcher-select";

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale();

  return (
    <LanguageSwitcherSelect
      className={className}
      defaultValue={locale}
      label="Select a locale"
    />
  );
}
