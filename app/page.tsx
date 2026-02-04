export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm text-zinc-500">Desafio II - To-Do List API</p>
        <h1 className="font-[var(--font-playfair)] text-4xl leading-tight">
          API REST com Next.js + Supabase (RLS)
        </h1>
        <p className="text-zinc-700">
          Use <code className="rounded bg-zinc-100 px-1.5 py-0.5">/api/tasks</code>{" "}
          para criar e listar tarefas.
        </p>
      </header>
    </main>
  );
}

