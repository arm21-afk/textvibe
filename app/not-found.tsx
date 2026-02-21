import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-mesh px-4 text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <main className="relative max-w-md text-center">
        <p className="text-6xl font-bold text-slate-800">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          The page you’re looking for doesn’t exist or the code may be invalid.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 hover:brightness-110"
        >
          Go to VibeText
        </Link>
      </main>
      <footer className="absolute bottom-6 text-xs text-slate-600">
        <Link href="/" className="transition hover:text-cyan-400">
          VibeText
        </Link>
      </footer>
    </div>
  );
}
