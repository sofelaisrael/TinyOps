"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Copy, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { type Prompt } from "@/lib/mdx";

type PkgManager = 'pnpm' | 'npm' | 'yarn';
type RepoMode = 'single' | 'monorepo';
type DbTool = 'prisma' | 'drizzle' | 'sql';

interface BetterPromptPanelProps {
  prompt: Prompt;
}

const STORAGE_PREFIX = 'better-prompt:';

export function BetterPromptPanel({ prompt }: BetterPromptPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pkgManager, setPkgManager] = useState<PkgManager | null>(null);
  const [repoMode, setRepoMode] = useState<RepoMode | null>(null);
  const [dbTool, setDbTool] = useState<DbTool | null>(null);
  const [copied, setCopied] = useState(false);

  const hasPkgOption = prompt.tags?.some(t => ['npm', 'yarn', 'pnpm', 'node'].includes(t.toLowerCase()));
  const hasRepoOption = prompt.tags?.some(t => ['monorepo', 'turborepo'].includes(t.toLowerCase()));
  const hasDbOption = prompt.category?.toLowerCase() === 'database';

  const hasAnyOption = hasPkgOption || hasRepoOption || hasDbOption;
  if (!hasAnyOption) return null;

  // Load persisted selections
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + prompt.slug);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.pkgManager) setPkgManager(data.pkgManager);
        if (data.repoMode) setRepoMode(data.repoMode);
        if (data.dbTool) setDbTool(data.dbTool);
      } else {
        // Set defaults
        if (hasPkgOption) setPkgManager('pnpm');
        if (hasRepoOption) setRepoMode('single');
        if (hasDbOption) setDbTool('prisma');
      }
    } catch {}
  }, [prompt.slug, hasPkgOption, hasRepoOption, hasDbOption]);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + prompt.slug, JSON.stringify({ pkgManager, repoMode, dbTool }));
    } catch {}
  }, [prompt.slug, pkgManager, repoMode, dbTool]);

  const buildContext = useCallback(() => {
    const parts: string[] = [];
    if (pkgManager) parts.push(`using ${pkgManager}`);
    if (repoMode) parts.push(repoMode === 'monorepo' ? 'in a monorepo' : 'in a single app');
    if (dbTool) {
      const dbName = dbTool === 'sql' ? 'raw SQL' : dbTool.charAt(0).toUpperCase() + dbTool.slice(1);
      parts.push(`using ${dbName}`);
    }
    if (parts.length === 0) return null;
    return `> Context: ${parts.join(', ')}.\n\n`;
  }, [pkgManager, repoMode, dbTool]);

  const handleCopyWithContext = async () => {
    const context = buildContext();
    const full = context ? context + prompt.content : prompt.content;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      toast.success('Copied with context', {
        description: context ? `Prepended: "${context.replace(/\n/g, '').slice(0, 60)}…"` : 'No context added',
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const pkgOptions: PkgManager[] = ['pnpm', 'npm', 'yarn'];
  const dbOptions: DbTool[] = ['prisma', 'drizzle', 'sql'];

  return (
    <div className="mb-8 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-neutral-50 border-b border-neutral-100 hover:bg-neutral-100/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-[13px] font-semibold text-neutral-800">Better Prompt</span>
          <span className="text-[10px] text-neutral-400">— tailor for your stack</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="p-5 space-y-4">
          {hasPkgOption && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                Package Manager
              </p>
              <div className="flex gap-2">
                {pkgOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPkgManager(pkgManager === opt ? null : opt)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all",
                      pkgManager === opt
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-700"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasRepoOption && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                Repository
              </p>
              <div className="flex gap-2">
                {(['single', 'monorepo'] as RepoMode[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setRepoMode(repoMode === opt ? null : opt)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[12px] font-medium border capitalize transition-all",
                      repoMode === opt
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-700"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasDbOption && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                Database
              </p>
              <div className="flex gap-2">
                {dbOptions.map((opt) => {
                  const label = opt === 'sql' ? 'Raw SQL' : opt.charAt(0).toUpperCase() + opt.slice(1);
                  return (
                    <button
                      key={opt}
                      onClick={() => setDbTool(dbTool === opt ? null : opt)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all",
                        dbTool === opt
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-700"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <p className="text-[11px] text-neutral-400">
              {buildContext()
                ? `Context: ${buildContext()?.replace(/\n/g, '')}`
                : 'No options selected'}
            </p>
            <button
              onClick={handleCopyWithContext}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all",
                copied
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-700 active:scale-[0.97]"
              )}
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5" /> Copied</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy with context</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
