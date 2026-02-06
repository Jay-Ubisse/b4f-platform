"use client";

import { logout } from "@/services/auth";

export default function HomePage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <h1 className="text-2xl font-bold">Bem-vindo à PU e-Learn Platform</h1>
        <p className="mt-4">
          Esta é a página inicial do seu aplicativo Next.js.
        </p>
        <button onClick={() => logout()}>Sair</button>
      </div>
    </div>
  );
}
