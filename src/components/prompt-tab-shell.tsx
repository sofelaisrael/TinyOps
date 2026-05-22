"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy, Check, Bot, CheckCircle, ArrowLeft,
  HelpCircle, FileCode, Key, GitBranch,
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { type Prompt } from '@/lib/mdx';
import PromptPageClient from '@/app/prompt/[slug]/prompt-page-client';
import { TabBar, type Tab } from '@/components/tab-bar';
import { SourcesTab } from '@/components/sources-tab';
import { BetterPromptPanel } from '@/components/better-prompt-panel';

const BADGE_STYLES: Record<string, string> = {
  deployment:    "bg-[#C5E8A0] text-[#2D5A0E]",
  testing:       "bg-[#A8D8F8] text-[#0D4A7A]",
  security:      "bg-[#B8CCFF] text-[#1A2F8A]",
  notifications: "bg-[#FFB8C6] text-[#7A1A2E]",
  notification:  "bg-[#FFB8C6] text-[#7A1A2E]",
  database:      "bg-[#FFE4A0] text-[#6B4400]",
  monorepo:      "bg-[#A8F0E0] text-[#0A5040]",
  performance:   "bg-[#FFD4A8] text-[#6B3000]",
  cleaning:      "bg-[#E0C8FF] text-[#3D1A7A]",
};

function getBadge(cat: string) {
  return BADGE_STYLES[cat.toLowerCase()] ?? "bg-neutral-200 text-neutral-700";
}

interface PromptTabShellProps {
  prompt: Prompt;
  relatedPrompts: Prompt[];
}

export function PromptTabShell({ prompt, relatedPrompts }: PromptTabShellProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'prompt';

  const footerTag = prompt.tags?.slice(0, 2).join(' / ').toUpperCase() || prompt.category.toUpperCase();

  const handleTabChange = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'prompt') params.delete('tab');
    else params.set('tab', tab);
    router.replace(`/prompt/${prompt.slug}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, prompt.slug]);

  const tabs: Tab[] = [
    { key: 'prompt', label: 'Prompt', badge: '1/1' },
    { key: 'sources', label: 'Sources' },
  ];

  return (
    <main className="flex-1 min-w-0">
      {/* Header — always visible */}
      <div className="mb-6">
        <span className={cn("inline-block px-3 py-1 rounded-full text-[12px] font-semibold capitalize mb-4", getBadge(prompt.category))}>
          {prompt.category}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
          <h1
            className="font-display font-black uppercase text-neutral-900 leading-none tracking-tight"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            {prompt.title}
          </h1>

          <PromptPageClient
            text={prompt.content.replace(/\[([^\]]+)\]\(#tooltip\s+"([^"]+)"\)/g, '$1')}
            slug={prompt.slug}
          />
        </div>

        <p className="text-[15px] text-neutral-600 leading-relaxed max-w-2xl">
          {prompt.description}
        </p>

        <div className="mt-6 w-full h-px bg-neutral-200" />
      </div>

      {/* Tab Bar */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'prompt' && (
            <>
              {/* Prompt Block */}
              <section className="relative mb-8">
                <TooltipProvider delayDuration={100}>
                  <div className="absolute -top-4 left-4 flex items-center gap-2 z-10">
                    <div className="bg-white text-neutral-600 text-xs px-3 py-1 rounded-full font-mono border border-neutral-200 shadow-sm">
                      AI Prompt
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-neutral-400 hover:text-neutral-700 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-neutral-900 border-neutral-800 text-neutral-200 max-w-xs">
                        <p>Copy this entire block and paste it into an LLM (like Claude or ChatGPT) to generate the exact code you need.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden mt-6">
                    <div className="px-6 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                      <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">Prompt Content</span>
                      <span className="text-[11px] text-neutral-400 uppercase tracking-widest">{footerTag}</span>
                    </div>

                    <div className="p-6">
                      <div className="prose max-w-none font-mono text-sm text-neutral-700">
                        <ReactMarkdown
                          components={{
                            a: ({ href, title, children, ...props }) => {
                              if (href === '#tooltip') {
                                return (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="underline decoration-dashed decoration-emerald-500/50 underline-offset-4 cursor-help text-emerald-700 font-semibold">
                                        {children}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-neutral-900 border-neutral-800 text-neutral-200 max-w-xs p-3 text-sm font-sans shadow-xl">
                                      <p className="leading-relaxed">{title}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              }
                              return <a href={href} title={title} className="text-blue-600 hover:underline" {...props}>{children}</a>;
                            },
                            h1: ({ children }) => <h1 className="text-xl font-bold text-neutral-900 mb-4 mt-6 font-sans">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold text-neutral-900 mb-3 mt-6 font-sans">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-bold text-neutral-900 mb-2 mt-4 font-sans">{children}</h3>,
                            p: ({ children }) => <p className="text-neutral-700 mb-4 leading-relaxed text-[14px]">{children}</p>,
                            code: ({ className, children }) => {
                              const isBlock = !!className;
                              if (!isBlock) return <code className="px-1.5 py-0.5 bg-neutral-100 text-neutral-800 text-[13px] rounded">{children}</code>;
                              return (
                                <pre className="bg-neutral-950 rounded-xl p-4 overflow-x-auto mb-4">
                                  <code className="text-neutral-200 text-[13px]">{children}</code>
                                </pre>
                              );
                            },
                            ul: ({ children }) => <ul className="list-none space-y-2 mb-4 pl-2">{children}</ul>,
                            li: ({ children }) => (
                              <li className="text-neutral-700 text-[14px] flex gap-2">
                                <span className="text-neutral-400 mt-0.5">—</span>
                                <span>{children}</span>
                              </li>
                            ),
                            strong: ({ children }) => <strong className="font-bold text-neutral-900">{children}</strong>,
                          }}
                        >
                          {prompt.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </TooltipProvider>
              </section>

              {/* How to use */}
              <section className="mb-12 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-5">
                  How to use this workflow
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-neutral-800 font-semibold text-sm">
                      <Copy className="w-4 h-4 text-emerald-600" />
                      1. Copy the Prompt
                    </div>
                    <p className="text-[13px] text-neutral-500 leading-relaxed">
                      Hit the copy button above. The text is engineered to prevent AI hallucinations.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-neutral-800 font-semibold text-sm">
                      <Bot className="w-4 h-4 text-emerald-600" />
                      2. Ask the AI
                    </div>
                    <p className="text-[13px] text-neutral-500 leading-relaxed">
                      Paste the prompt into Claude 3.5 Sonnet (recommended) or ChatGPT. It will output the YAML.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-neutral-800 font-semibold text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      3. Save & Ship
                    </div>
                    <p className="text-[13px] text-neutral-500 leading-relaxed">
                      Paste the AI's output into the exact file paths listed in the Implementation Guide.
                    </p>
                  </div>
                </div>
              </section>

              {/* Better Prompt customization */}
              <BetterPromptPanel prompt={prompt} />

              {/* Related prompts */}
              {relatedPrompts.length > 0 && (
                <section>
                  <h2
                    className="font-display font-black uppercase text-neutral-900 leading-none tracking-tight mb-6"
                    style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
                  >
                    Related
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPrompts.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={`/prompt/${rp.slug}`}
                        className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
                      >
                        <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize mb-3", getBadge(rp.category))}>
                          {rp.category}
                        </span>
                        <h3
                          className="font-display font-black uppercase text-neutral-900 leading-tight mb-2"
                          style={{ fontSize: "clamp(16px, 2vw, 19px)" }}
                        >
                          {rp.title}
                        </h3>
                        <p className="text-[12px] text-neutral-500 line-clamp-2">{rp.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {activeTab === 'sources' && (
            <SourcesTab sources={prompt.sources} slug={prompt.slug} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
