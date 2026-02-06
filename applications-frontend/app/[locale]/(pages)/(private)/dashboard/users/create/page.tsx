import { CreateUserForm } from "@/components/forms/create-user";

export default function CreateUserPage() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background px-4 py-10">
      {/* Background: brand gradient + soft grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="absolute -top-24 -left-24 size-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 size-[420px] rounded-full bg-secondary/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] w-full max-w-3xl items-center justify-center">
        <CreateUserForm />
      </div>
    </div>
  );
}
