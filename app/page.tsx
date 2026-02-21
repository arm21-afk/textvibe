"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupCode, setLookupCode] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function handleGenerate() {
    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedCode(null);
    setGeneratedUrl(null);

    try {
      const res = await fetch("/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "Failed to generate code. Please try again."
        );
      }

      const json = (await res.json()) as { code: string; url: string };
      setGeneratedCode(json.code);
      setGeneratedUrl(json.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenByCode() {
    const code = lookupCode.trim().toUpperCase();
    if (!code) return;
    router.push(`/text/${encodeURIComponent(code)}`);
  }

  async function copyToClipboard(value: string, kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh text-slate-100">
      {/* Decorative grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <header className="relative border-b border-slate-800/50 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-lg font-semibold tracking-tight text-white transition hover:text-cyan-300"
          >
            <span className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 px-2 py-0.5 font-mono text-cyan-400 ring-1 ring-cyan-500/30">
              VibeText
            </span>
          </Link>
          <span className="rounded-full border border-slate-600/50 bg-slate-800/30 px-3 py-1 text-xs font-medium text-slate-400 backdrop-blur-sm">
            No sign-up · Just a code
          </span>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        {/* Hero */}
        <section className="text-center sm:text-left">
          <p className="animate-fade-up animate-fade-up-1 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-medium text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Share text instantly
          </p>
          <h1 className="animate-fade-up animate-fade-up-2 mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Paste. Get a code.{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Open anywhere.
            </span>
          </h1>
          <p className="animate-fade-up animate-fade-up-3 mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            Drop any text, get a short code. Open that code on any device to see it.
            No accounts, no email — just a code.
          </p>
        </section>

        {/* Main card */}
        <section className="animate-fade-up animate-fade-up-4 mt-10 space-y-4">
          <div className="glass glow-ring rounded-2xl p-5 sm:p-6 transition-shadow duration-300 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.15)]">
            <label
              htmlFor="main-text"
              className="block text-sm font-medium text-slate-300"
            >
              Your text
            </label>
            <textarea
              id="main-text"
              aria-describedby={error ? "main-text-error" : undefined}
              className="mt-2 min-h-[200px] w-full resize-y rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Paste notes, links, code snippets… then click Generate code."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error && (
              <p id="main-text-error" className="mt-2 text-sm text-rose-400" role="alert">
                {error}
              </p>
            )}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">
                {text.length.toLocaleString()} characters
              </span>
              <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                    Generating…
                  </span>
                ) : (
                  "Generate code"
                )}
              </button>
            </div>

            {generatedCode && generatedUrl && (
              <div
                className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-medium text-slate-200">
                  Your code & link
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-slate-800/80 px-3 py-2 font-mono text-sm font-semibold text-cyan-300 ring-1 ring-cyan-500/30">
                    {generatedCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedCode, "code")}
                    className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-500/30 hover:bg-slate-700/80 hover:text-white"
                  >
                    {copied === "code" ? "✓ Copied!" : "Copy code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedUrl, "link")}
                    className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-500/30 hover:bg-slate-700/80 hover:text-white"
                  >
                    {copied === "link" ? "✓ Copied!" : "Copy link"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  On any device: open this site, enter the code, or use the link.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Open by code */}
        <section className="animate-fade-up animate-fade-up-5 mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Open by code
          </h2>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Enter code (e.g. A1B2C3)"
              className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleOpenByCode()}
            />
            <button
              type="button"
              onClick={handleOpenByCode}
              className="rounded-xl border border-slate-600 bg-slate-800/80 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-500/30 hover:bg-slate-700/80 hover:text-white"
            >
              Open
            </button>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20 grid gap-5 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Paste text",
              desc: "Type or paste anything — notes, links, or code.",
            },
            {
              step: "2",
              title: "Get a code",
              desc: "Click Generate code. You get a 6-character code and shareable link.",
            },
            {
              step: "3",
              title: "Open anywhere",
              desc: "On any device, enter the code or open the link to see your text.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="glass group rounded-2xl border border-slate-700/50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/20 hover:shadow-[0_0_30px_-8px_rgba(34,211,238,0.12)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 text-lg font-bold text-cyan-400 ring-1 ring-cyan-500/20 transition group-hover:ring-cyan-500/40">
                {item.step}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-200">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative border-t border-slate-800/50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-cyan-400"
          >
            VibeText
          </Link>
          <p className="text-xs text-slate-600">
            Next.js · Tailwind CSS · PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  );
}
