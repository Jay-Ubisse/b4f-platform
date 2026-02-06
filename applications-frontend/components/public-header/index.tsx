"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import LanguageSwitcher from "../language-switcher";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";

export function Header() {
  const t = useTranslations("Public.HomePage.NavBar");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2">
                <span className="text-white font-semibold tracking-wide">
                  BYTES4FUTURE
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex gap-6 text-white/90 text-sm">
                <Link className="hover:text-white" href="/">
                  {t("B4F")}
                </Link>
                <Link className="hover:text-white" href="/">
                  {t("Program")}
                </Link>
                <Link className="hover:text-white" href="/">
                  {t("Purpose")}
                </Link>
                <Link className="hover:text-white" href="/">
                  {t("FAQ")}
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mt-2 rounded-2xl border border-white/15 bg-violet-900/40 backdrop-blur-md overflow-hidden">
              <nav className="flex flex-col gap-1 p-3 text-white/90 text-sm">
                <Link
                  href="/"
                  className="rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  {t("B4F")}
                </Link>
                <Link
                  href="/"
                  className="rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  {t("Program")}
                </Link>
                <Link
                  href="/"
                  className="rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  {t("Purpose")}
                </Link>
                <Link
                  href="/"
                  className="rounded-xl px-3 py-2 hover:bg-white/10"
                >
                  {t("FAQ")}
                </Link>

                <div className="mt-2 border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-xs text-white/70">
                    {t("ThemeLabel") ?? "Tema"}
                  </span>
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
