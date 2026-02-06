import { CandidateApplicationForm } from "@/components/forms/candidate-application";
import { Header } from "@/components/public-header";

export default function CandidateApplicationPage() {
  return (
    <main className="relative min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/home-background.jpg')` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/75 via-violet-700/70 to-indigo-700/70" />

      <div className="relative min-h-screen flex flex-col">
        <Header />

        {/* Content */}
        <section className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-full max-w-2xl">
            <CandidateApplicationForm />
          </div>
        </section>

        {/* Bottom fade */}
        <div className="pointer-events-none h-16 bg-gradient-to-t from-black/15 to-transparent" />
      </div>
    </main>
  );
}
