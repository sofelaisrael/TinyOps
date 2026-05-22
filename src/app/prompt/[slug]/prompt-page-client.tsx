'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Share2, BookMarked, FileText, ListOrdered, Code, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Prompt } from '@/lib/mdx';

interface PromptPageClientProps {
  text: string;
  slug: string;
  prompt?: Prompt;
}

export default function PromptPageClient({ text, slug, prompt }: PromptPageClientProps) {
  const [copied, setCopied] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!', {
        description: 'The prompt content has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy', {
        description: 'Unable to copy to clipboard. Please try again.',
      });
    }
  };

  const handleCopyInstructions = async () => {
    const instructions = `<projectInstructions>\n\n${text}\n\n</projectInstructions>`;
    try {
      await navigator.clipboard.writeText(instructions);
      setCopiedInstructions(true);
      toast.success('Copied as Claude Project Instructions', {
        description: 'Paste this into a Claude Project for reproducible results.',
        icon: <BookMarked className="w-4 h-4 text-emerald-500" />,
      });
      setTimeout(() => setCopiedInstructions(false), 2000);
    } catch (err) {
      toast.error('Failed to copy', {
        description: 'Unable to copy to clipboard. Please try again.',
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TinyOps Prompt',
          text: text.slice(0, 100) + '...',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied!', {
          description: 'The page URL has been copied to your clipboard.',
        });
      }
    } catch (err) {
      // User cancelled or sharing not supported
    }
  };

  const quality = useMemo(() => {
    const hasCodeBlocks = /```[\s\S]*?```/.test(text);
    const inlineCode = (text.match(/`[^`]+`/g) || []).length;
    const hasBulletList = /^[-*+]\s/m.test(text);
    const hasNumberedSteps = /^\d+\.\s/m.test(text);
    const wordCount = text.split(/\s+/).length;
    const hasPrereqs = /prerequisites?|requirements?|setup|before you begin/i.test(text);
    const hasYaml = /yaml|yml|workflow:|on:|jobs:|steps:/i.test(text);

    const checks = [
      hasCodeBlocks,
      hasPrereqs,
      hasNumberedSteps,
      hasYaml,
      hasBulletList,
    ];
    const score = checks.filter(Boolean).length;
    const level = score >= 4 ? 'High' : score >= 2 ? 'Medium' : 'Low';

    return { wordCount, hasCodeBlocks, inlineCode, hasNumberedSteps, hasPrereqs, hasYaml, score, level };
  }, [text]);

  return (
    <div className="flex flex-col gap-3 sm:min-w-[180px]">
      {/* Copy Prompt */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-700 text-white font-semibold text-[13px] rounded-full transition-all active:scale-[0.97]"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Prompt
          </>
        )}
      </button>

      {/* Copy as Claude Project Instructions */}
      <button
        onClick={handleCopyInstructions}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-500 text-[13px] font-semibold hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all"
      >
        {copiedInstructions ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            Copied!
          </>
        ) : (
          <>
            <BookMarked className="w-4 h-4" />
            <span className="text-[11px]">as Project Instructions</span>
          </>
        )}
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-600 text-[13px] font-semibold hover:border-neutral-500 hover:text-neutral-900 transition-all"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Prompt Quality */}
      <div className="mt-1 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Prompt Quality
          </h4>
          <span className={cn(
            "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full",
            quality.level === 'High' && "bg-emerald-100 text-emerald-700",
            quality.level === 'Medium' && "bg-amber-100 text-amber-700",
            quality.level === 'Low' && "bg-neutral-200 text-neutral-500",
          )}>
            {quality.level}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <FileText className="w-3 h-3" />
              Words
            </span>
            <span className="text-[12px] font-mono font-semibold text-neutral-700">
              {quality.wordCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Code className="w-3 h-3" />
              Code blocks
            </span>
            <span className={cn(
              "text-[12px] font-mono font-semibold",
              quality.hasCodeBlocks ? "text-emerald-600" : "text-neutral-300"
            )}>
              {quality.hasCodeBlocks ? '✓' : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <ListOrdered className="w-3 h-3" />
              Prerequisites
            </span>
            <span className={cn(
              "text-[12px] font-mono font-semibold",
              quality.hasPrereqs ? "text-emerald-600" : "text-neutral-300"
            )}>
              {quality.hasPrereqs ? '✓' : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Sparkles className="w-3 h-3" />
              Steps
            </span>
            <span className={cn(
              "text-[12px] font-mono font-semibold",
              quality.hasNumberedSteps ? "text-emerald-600" : "text-neutral-300"
            )}>
              {quality.hasNumberedSteps ? '✓' : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
