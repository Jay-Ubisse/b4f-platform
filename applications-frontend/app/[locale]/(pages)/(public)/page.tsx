import Link from "next/link";
import { useTranslations } from "next-intl";

import { Header } from "@/components/public-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("Public.HomePage");

  return (
    <main className="relative min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/home-background.jpg')` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/75 via-violet-700/70 to-indigo-700/70" />

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        <Header />

        <section className="flex-1 flex items-center">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="text-center text-white">
                <h1 className="mt-5 font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  {t("Title")}
                </h1>

                <p className="mt-4 mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-white/90">
                  {t("Subtitle")}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/application" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto rounded-xl bg-emerald-700 hover:bg-emerald-700/90 text-sm md:text-base">
                      {t("ApplicationButton")}
                    </Button>
                  </Link>

                  <Link href="/search-candidate" className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto rounded-xl text-sm md:text-base"
                    >
                      {t("ApplicationStatusButton")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom fade */}
        <div className="pointer-events-none h-16 bg-gradient-to-t from-black/15 to-transparent" />
      </div>
    </main>
  );
}
