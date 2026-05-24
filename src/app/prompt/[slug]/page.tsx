import { notFound } from 'next/navigation';
import { getAllPrompts } from '@/lib/mdx';
import { ArrowLeft, FileCode, Key, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { PromptTabShell } from '@/components/prompt-tab-shell';
import { Footer } from '@/components/footer';
import { Suspense } from 'react';

interface PromptPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const prompts = getAllPrompts();
  return prompts.map((prompt) => ({ slug: prompt.slug }));
}

export async function generateMetadata({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompts = getAllPrompts();
  const prompt = prompts.find((p) => p.slug === slug);
  if (!prompt) return { title: 'Prompt Not Found - TinyOps' };
  const canonicalUrl = `https://tinyops.vercel.app/prompt/${prompt.slug}`;
  return {
    title: `${prompt.title} - TinyOps`,
    description: prompt.description,
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      type: 'article',
      publishedTime: prompt.date,
      authors: ['TinyOps'],
      images: [{ url: `https://tinyops.vercel.app/api/og?slug=${prompt.slug}`, width: 1200, height: 630, alt: prompt.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.description,
      images: [`https://tinyops.vercel.app/api/og?slug=${prompt.slug}`],
    },
    other: {
      'og:article:section': prompt.category,
      'article:published_time': prompt.date,
    },
  };
}

// Pastel badge colours — same as card
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

export default async function PromptPage({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompts = getAllPrompts();
  const prompt = prompts.find((p) => p.slug === slug);
  if (!prompt) notFound();

  const relatedPrompts = prompts
    .filter((p) => p.category === prompt.category && p.slug !== prompt.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#EDEBE7]">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-[#EDEBE7] border-b border-neutral-200/80">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-[13px] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Library
          </Link>
          <Logo />
          <div className="w-16" /> {/* spacer to centre logo */}
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 flex gap-10 pt-10 pb-20">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-44 flex-shrink-0">
          <div className="sticky top-24 space-y-6">

            {/* Category */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                Category
              </p>
              <span className={cn("inline-block px-3 py-1 rounded-full text-[12px] font-semibold capitalize", getBadge(prompt.category))}>
                {prompt.category}
              </span>
            </div>

            {/* Tags */}
            {prompt.tags?.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {prompt.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-mono text-neutral-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Files Affected */}
            {prompt.files?.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5">
                  <FileCode className="w-3 h-3" />
                  Files
                </p>
                <div className="space-y-1">
                  {prompt.files.map((file) => (
                    <div key={file} className="font-mono text-[11px] text-neutral-500 bg-white border border-neutral-200 px-2 py-1.5 rounded break-all">
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Secrets */}
            {prompt.secrets?.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5">
                  <Key className="w-3 h-3" />
                  Secrets
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {prompt.secrets.map((secret) => (
                    <span key={secret} className="text-[10px] font-bold font-mono bg-white border border-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded uppercase">
                      {secret}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Example Repo */}
            {prompt.repoExample && prompt.repoUrl && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5">
                  <GitBranch className="w-3 h-3" />
                  Example Repo
                </p>
                <a
                  href={prompt.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors underline underline-offset-2"
                >
                  {prompt.repoExample}
                </a>
              </div>
            )}

            {/* Related */}
            {relatedPrompts.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                  Related
                </p>
                <ul className="space-y-2">
                  {relatedPrompts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/prompt/${p.slug}`}
                        className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors line-clamp-2"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main ── */}
        <Suspense fallback={<div className="flex-1 min-w-0 rounded-2xl bg-white/60 animate-pulse h-96" />}>
          <PromptTabShell prompt={prompt} relatedPrompts={relatedPrompts} />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
