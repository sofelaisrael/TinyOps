'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { type Prompt } from '@/lib/mdx';
import { PromptCard } from '@/components/prompt-card';
import { ShortcutsModal } from '@/components/modals';
import { useFavorites } from '@/lib/favorites';
import { Logo } from '@/components/logo';

export default function FavoritesPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, isLoaded } = useFavorites();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const res = await fetch('/api/prompts');
        if (res.ok) setPrompts(await res.json());
      } finally {
        setIsLoading(false);
      }
    };
    loadPrompts();
  }, []);

  const favoritePrompts = useMemo(
    () => prompts.filter((p) => favorites.includes(p.slug)),
    [prompts, favorites]
  );

  return (
    <div className="min-h-screen bg-[#EDEBE7]">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-[#EDEBE7] border-b border-neutral-200/80">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Logo />
          <div className="w-16" /> {/* spacer */}
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 flex gap-10 pt-10 pb-20">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-44 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
                Favorites
              </p>
            </div>
            <p className="text-[14px] text-neutral-600">
              {isLoaded ? `${favorites.length} saved` : '…'}
            </p>
            <Link
              href="/"
              className="block text-[13px] text-neutral-400 hover:text-neutral-800 transition-colors underline underline-offset-2"
            >
              Browse all prompts
            </Link>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 min-w-0">
          <h1
            className="font-display font-black uppercase text-neutral-900 leading-none tracking-tight mb-8 anim-1"
            style={{ fontSize: "clamp(52px, 8vw, 72px)" }}
          >
            MY<br />FAVORITES
          </h1>

          {!isLoaded || isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl bg-white/60 animate-pulse"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          ) : favoritePrompts.length > 0 ? (
            <>
              <p className="text-[13px] text-neutral-400 mb-6">
                {favoritePrompts.length} saved prompt{favoritePrompts.length !== 1 ? 's' : ''}
              </p>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {favoritePrompts.map((prompt, i) => (
                    <PromptCard key={prompt.slug} prompt={prompt} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center mb-5">
                <Heart className="w-7 h-7 text-neutral-300" />
              </div>
              <h3 className="font-display font-black uppercase text-2xl text-neutral-400 mb-2">
                No favorites yet
              </h3>
              <p className="text-neutral-500 text-sm max-w-xs mb-6">
                Tap the heart on any prompt to save it here. Stored in your browser.
              </p>
              <Link
                href="/"
                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white font-medium text-sm rounded-full hover:bg-neutral-700 transition-all active:scale-[0.97]"
              >
                <Search className="w-4 h-4" />
                Browse prompts
              </Link>
            </motion.div>
          )}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200/80 py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[12px] text-neutral-400">© {new Date().getFullYear()} TinyOps Labs</span>
          <Link href="/" className="text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors">
            ← Browse all
          </Link>
        </div>
      </footer>

      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
}
