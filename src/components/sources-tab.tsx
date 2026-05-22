"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, MessageSquare, Code, BookOpen } from "lucide-react";
import { type SourceLink } from '@/lib/mdx';

interface SourcesTabProps {
  sources?: SourceLink[];
  slug: string;
}

export function SourcesTab({ sources, slug }: SourcesTabProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    stackoverflow: true,
    github: true,
    devto: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!sources || sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-5 shadow-sm">
          <MessageSquare className="w-7 h-7 text-neutral-300" />
        </div>
        <h3 className="font-display font-black uppercase text-2xl text-neutral-400 mb-2">No sources yet</h3>
        <p className="text-neutral-500 text-sm max-w-md mb-6 leading-relaxed">
          Community-sourced Stack Overflow discussions, GitHub examples, and articles will appear here once curated.
        </p>
        <a
          href={`/coming-soon?page=Suggest+source+for+${slug}`}
          className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
        >
          Suggest a source
        </a>
      </div>
    );
  }

  const stackoverflow = sources.filter(s => s.type === 'stackoverflow');
  const github = sources.filter(s => s.type === 'github');
  const devto = sources.filter(s => s.type === 'devto');

  return (
    <div className="space-y-4">
      {stackoverflow.length > 0 && (
        <SectionCard
          title="Stack Overflow"
          icon={<MessageSquare className="w-4 h-4" />}
          isExpanded={expandedSections.stackoverflow}
          onToggle={() => toggleSection('stackoverflow')}
          count={stackoverflow.length}
        >
          {stackoverflow.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-semibold text-neutral-800 group-hover:text-neutral-900 flex-1 leading-snug">
                  {item.title}
                </p>
                {item.votes !== undefined && (
                  <span className="flex-shrink-0 text-[11px] font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                    {item.votes}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-400 group-hover:text-neutral-600 transition-colors">
                <ExternalLink className="w-3 h-3" />
                View on Stack Overflow
              </div>
            </a>
          ))}
        </SectionCard>
      )}

      {github.length > 0 && (
        <SectionCard
          title="GitHub Workflow Examples"
          icon={<Code className="w-4 h-4" />}
          isExpanded={expandedSections.github}
          onToggle={() => toggleSection('github')}
          count={github.length}
        >
          {github.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {item.repo && (
                    <p className="text-[13px] font-semibold text-neutral-800">{item.repo}</p>
                  )}
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5 truncate">{item.title}</p>
                </div>
                {item.stars !== undefined && (
                  <span className="flex-shrink-0 text-[11px] font-mono text-neutral-400">
                    ★ {item.stars}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-400 group-hover:text-neutral-600 transition-colors">
                <ExternalLink className="w-3 h-3" />
                View file
              </div>
            </a>
          ))}
        </SectionCard>
      )}

      {devto.length > 0 && (
        <SectionCard
          title="Dev.to Articles"
          icon={<BookOpen className="w-4 h-4" />}
          isExpanded={expandedSections.devto}
          onToggle={() => toggleSection('devto')}
          count={devto.length}
        >
          {devto.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all group"
            >
              <p className="text-[13px] font-semibold text-neutral-800 group-hover:text-neutral-900 leading-snug">
                {item.title}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-400">
                {item.author && <span>by {item.author}</span>}
                {item.reactions !== undefined && <span>❤️ {item.reactions}</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-400 group-hover:text-neutral-600 transition-colors">
                <ExternalLink className="w-3 h-3" />
                Read article
              </div>
            </a>
          ))}
        </SectionCard>
      )}
    </div>
  );
}

function SectionCard({
  title,
  icon,
  isExpanded,
  onToggle,
  count,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-neutral-500">{icon}</span>
          <span className="text-[13px] font-semibold text-neutral-800">{title}</span>
          <span className="text-[10px] font-mono bg-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded-full">{count}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>
      {isExpanded && (
        <div className="p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
