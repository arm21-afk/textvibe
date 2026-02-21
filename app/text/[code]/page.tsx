"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type TextData = {
  code: string;
  content: string;
  createdAt: string;
};

export default function TextViewPage() {
  const params = useParams<{ code: string }>();
  const code = params.code ?? "";

  const [data, setData] = useState<TextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/text/${encodeURIComponent(code)}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("not-found");
          }
          throw new Error("Failed to load text.");
        }
        const json = (await res.json()) as TextData;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error && err.message === "not-found"
              ? "No text found for this code. It may have expired or the code is wrong."
              : err instanceof Error
                ? err.message
                : "Failed to load text."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [code]);

  async function copyText() {
    if (!data?.content) return;
    try {
      await navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const display = data?.content ?? "";

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh text-slate-100">
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
            className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
          >
            ← Back to VibeText
          </Link>
          <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 font-mono text-xs font-medium text-cyan-300 ring-1 ring-cyan-500/20">
            {code}
          </span>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        {loading && (
          <div className="glass flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
            <p className="mt-4 text-sm text-slate-500">Loading…</p>
          </div>
        )}

        {!loading && error && (
          <div
            className="glass rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center"
            role="alert"
          >
            <p className="text-sm font-medium text-amber-200">{error}</p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-slate-800/80 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/80 hover:text-white"
            >
              Go home
            </Link>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl font-semibold text-white">
                Shared text
              </h1>
              {display.length > 0 && (
                <button
                  type="button"
                  onClick={() => void copyText()}
                  className="rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-500/30 hover:bg-slate-700/80 hover:text-white"
                >
                  {copied ? "✓ Copied!" : "Copy text"}
                </button>
              )}
            </div>
            <div className="glass glow-ring rounded-2xl border border-slate-700/50 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.1)]">
              <pre className="whitespace-pre-wrap break-words p-5 text-sm leading-relaxed text-slate-300 sm:p-6">
                {display || "No content for this code."}
              </pre>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Open this page on any device with the same code to see this text.
            </p>
          </>
        )}
      </main>

      <footer className="relative border-t border-slate-800/50 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center text-xs text-slate-600">
          <Link href="/" className="transition hover:text-cyan-400">
            VibeText
          </Link>
          {" · "}
          Share text with a code
        </div>
      </footer>
    </div>
  );
}
