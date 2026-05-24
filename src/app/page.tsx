"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Command as CommandIcon, Heart,
  Zap, GitBranch, Shield, ShieldCheck, Database, Bell, Layers, Gauge, Bug, BotMessageSquare,
  Wrench, Settings, Receipt, Terminal,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { type Prompt } from "@/lib/mdx";
import { PromptCard } from "@/components/prompt-card";
import { ShortcutsModal } from "@/components/modals";
import { SuggestPromptModal } from "@/components/suggest-prompt-modal";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useRecentlyViewed } from "@/lib/favorites";
import { useSearchParams, useRouter } from "next/navigation";
import { MobileFilterButton, MobileFilterDrawer } from "@/components/mobile-filter-drawer";
import { Footer } from "@/components/footer";

const PROMPTS_PER_PAGE = 12;

// ── Platform filter — Vercel + GitHub Actions only ──
const PLATFORMS = ["Vercel", "GitHub Actions"];

function matchesPlatform(prompt: Prompt, platform: string) {
  const haystack = [...prompt.tags, prompt.category, prompt.title, prompt.content]
    .join(" ").toLowerCase();
  if (platform === "Vercel") return haystack.includes("vercel");
  if (platform === "GitHub Actions") return haystack.includes("github") || haystack.includes("actions");
  return true;
}

// ── Category → icon ──
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  deployment:        <Zap className="w-3.5 h-3.5" />,
  testing:           <Bug className="w-3.5 h-3.5" />,
  security:          <ShieldCheck className="w-3.5 h-3.5" />,
  database:          <Database className="w-3.5 h-3.5" />,
  notifications:     <Bell className="w-3.5 h-3.5" />,
  monorepo:          <Layers className="w-3.5 h-3.5" />,
  performance:       <Gauge className="w-3.5 h-3.5" />,
  "advanced ci/cd":  <GitBranch className="w-3.5 h-3.5" />,
  build:             <Wrench className="w-3.5 h-3.5" />,
  configuration:     <Settings className="w-3.5 h-3.5" />,
  "cost optimization": <Receipt className="w-3.5 h-3.5" />,
  debugging:         <Terminal className="w-3.5 h-3.5" />,
};
function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat.toLowerCase()] ?? <GitBranch className="w-3.5 h-3.5" />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EDEBE7]" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites } = useFavorites();
  const { recentSlugs } = useRecentlyViewed();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : '/', { scroll: false });
  };

  useEffect(() => {
    let cancelled = false;
    const loadPrompts = async () => {
      try {
        const res = await fetch("/api/prompts");
        if (res.ok && !cancelled) setPrompts(await res.json());
      } catch {
        if (!cancelled) setPrompts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadPrompts();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "?" && document.activeElement?.tagName !== "INPUT") {
        setIsShortcutsOpen(true);
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(prompts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [prompts]);

  const filteredPrompts = useMemo(() => prompts.filter((prompt) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      prompt.title.toLowerCase().includes(q) ||
      prompt.description.toLowerCase().includes(q) ||
      prompt.category.toLowerCase().includes(q) ||
      prompt.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    const matchesPlatformFilter = !selectedPlatform || matchesPlatform(prompt, selectedPlatform);
    return matchesSearch && matchesCategory && matchesPlatformFilter;
  }), [prompts, searchQuery, selectedCategory, selectedPlatform]);

  const isFiltered = !!searchQuery || !!selectedCategory || !!selectedPlatform;

  const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE));

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);
    if (end - start + 1 < 3) start = Math.max(1, end - 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);
  const paginatedPrompts = useMemo(
    () => filteredPrompts.slice((currentPage - 1) * PROMPTS_PER_PAGE, currentPage * PROMPTS_PER_PAGE),
    [filteredPrompts, currentPage]
  );

  // Reset to page 1 & scroll up when filters change
  useEffect(() => {
    goToPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedPlatform]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Prompts saved as favorites (for sidebar list)
  const favoritedPrompts = useMemo(
    () => prompts.filter((p) => favorites.includes(p.slug)).slice(0, 5),
    [prompts, favorites]
  );

  const recentlyViewedPrompts = useMemo(
    () => {
      const slugs = recentSlugs.slice(0, 5);
      return slugs.map((slug) => prompts.find((p) => p.slug === slug)).filter(Boolean) as Prompt[];
    },
    [prompts, recentSlugs]
  );

  return (
    <div className="min-h-screen bg-[#EDEBE7]">

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-[#EDEBE7] border-b border-neutral-200/80">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center gap-4">

          <Logo />

          {/* Search — centred */}
          <div className="hidden md:flex flex-1 justify-center px-2 sm:px-4 min-w-0">
            <div className="relative w-full max-w-[520px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search automation prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-pill w-full bg-white rounded-full border border-neutral-200 text-[13px] leading-tight text-neutral-800 placeholder:text-neutral-400 pl-10 pr-10 py-2.5 transition-shadow"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
            <MobileFilterButton onClick={() => setIsMobileFiltersOpen(true)} />

            <Link
              href="/favorites"
              className={cn(
                "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border text-[13px] font-medium transition-all",
                favorites.length > 0
                  ? "border-rose-300 text-rose-600 bg-rose-50 hover:bg-rose-100"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800"
              )}
            >
              <Heart className={cn("w-3.5 h-3.5", favorites.length > 0 && "fill-current")} />
              {favorites.length > 0 && <span>{favorites.length}</span>}
            </Link>

            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-700 transition-all"
            >
              <BotMessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Suggest</span>
            </button>

            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 transition-all"
              title="Keyboard shortcuts (?)"
            >
              <CommandIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Body: sidebar + main ── */}
      <div className="max-w-[1200px] mx-auto px-6 flex gap-10 pt-6 pb-20">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-44 flex-shrink-0">
          <div className="sticky top-24 space-y-7">

            {/* Platform — Vercel + GitHub Actions only */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                Platform
              </p>
              <ul className="space-y-2">
                {PLATFORMS.map((p) => (
                  <li key={p}>
                    <button
                      onClick={() => setSelectedPlatform(selectedPlatform === p ? null : p)}
                      className={cn(
                        "text-[14px] leading-snug transition-colors w-full text-left",
                        selectedPlatform === p
                          ? "font-semibold text-neutral-900 underline underline-offset-2"
                          : "text-neutral-500 hover:text-neutral-900"
                      )}
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                Categories
              </p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "text-[14px] leading-snug transition-colors w-full text-left",
                      !selectedCategory
                        ? "font-semibold text-neutral-900 underline underline-offset-2"
                        : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    All
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={cn(
                        "flex items-center gap-2 text-[14px] leading-snug transition-colors w-full text-left capitalize",
                        selectedCategory === cat
                          ? "font-semibold text-neutral-900 underline underline-offset-2"
                          : "text-neutral-500 hover:text-neutral-900"
                      )}
                    >
                      <span className="text-neutral-400">{getCategoryIcon(cat)}</span>
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recently viewed */}
            {recentlyViewedPrompts.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                  Recently Viewed
                </p>
                <ul className="space-y-2">
                  {recentlyViewedPrompts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/prompt/${p.slug}`}
                        className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors line-clamp-1"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Saved favorites list */}
            {favoritedPrompts.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                  Favorites
                </p>
                <ul className="space-y-2">
                  {favoritedPrompts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/prompt/${p.slug}`}
                        className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors line-clamp-1"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                  {favorites.length > 5 && (
                    <li>
                      <Link href="/favorites" className="text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2">
                        View all {favorites.length}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}

          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 min-w-0">

          {/* Heading */}
          <h1
            className="font-display font-black uppercase text-neutral-900 leading-none tracking-tight mb-8 anim-1"
            style={{ fontSize: "clamp(52px, 8vw, 72px)" }}
          >
            {selectedCategory
              ? <>{selectedCategory.toUpperCase()}<br />PROMPTS</>
              : selectedPlatform === "Vercel"
              ? <>VERCEL<br />WORKFLOWS</>
              : selectedPlatform === "GitHub Actions"
              ? <>GITHUB<br />ACTIONS</>
              : <>BROWSE<br />AUTOMATIONS</>
            }
          </h1>

          {/* Active filter chips */}
          {isFiltered && (
            <div className="flex flex-wrap gap-2 mb-5 anim-2">
              {selectedPlatform && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full text-[12px] font-medium">
                  {selectedPlatform}
                  <button onClick={() => setSelectedPlatform(null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full text-[12px] font-medium capitalize">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full text-[12px] font-medium">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={() => { setSelectedCategory(null); setSelectedPlatform(null); setSearchQuery(""); }}
                className="text-[12px] text-neutral-400 hover:text-neutral-800 transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Result count */}
          <p className="text-[13px] text-neutral-400 mb-6 anim-2">
            {isLoading
              ? "Loading prompts…"
              : filteredPrompts.length === 0
                ? "0 prompts"
                : `Showing ${(currentPage - 1) * PROMPTS_PER_PAGE + 1}–${Math.min(currentPage * PROMPTS_PER_PAGE, filteredPrompts.length)} of ${filteredPrompts.length} ${filteredPrompts.length === 1 ? "prompt" : "prompts"}`
            }
          </p>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-white/60 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          ) : filteredPrompts.length > 0 ? (
            <>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="wait">
                  {paginatedPrompts.map((prompt, i) => (
                    <PromptCard key={prompt.slug} prompt={prompt} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* ── Pagination — GitHub-style window ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-10">
                  <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={cn(
                        "flex items-center justify-center min-w-[36px] h-9 rounded-full text-[13px] font-medium transition-all",
                        page === currentPage
                          ? "bg-neutral-900 text-white"
                          : "bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800"
                      )}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-5 shadow-sm">
                <Search className="w-7 h-7 text-neutral-300" />
              </div>
              <h3 className="font-display font-black uppercase text-2xl text-neutral-400 mb-2">No results</h3>
              <p className="text-neutral-500 text-sm max-w-xs mb-6">
                No prompts match &quot;{searchQuery}&quot;
                {selectedCategory ? ` in ${selectedCategory}` : ""}.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); setSelectedPlatform(null); }}
                className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </main>
      </div>

      {/* ── Newsletter ── */}
      <section className="border-t border-neutral-200/80 bg-white/40 py-20">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs text-neutral-500 border border-neutral-200 bg-white">
            <Bell className="w-3 h-3" /> New prompts every Tuesday
          </div>
          <h2
            className="font-display font-black uppercase text-neutral-900 leading-none tracking-tight mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 52px)" }}
          >
            Stay in the loop.
          </h2>
          <p className="text-neutral-500 mb-8 text-[15px]">
            Get fresh CI/CD prompts delivered to your inbox. Pure signal, zero noise.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
              try {
                const res = await fetch("/api/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                if (!res.ok) throw new Error("Failed");
                toast.success("You're subscribed!", { description: "Expect your first drop next Tuesday." });
                form.reset();
              } catch {
                toast.error("Subscription failed", { description: "Please try again later." });
              }
            }}
            className="flex max-w-xs sm:max-w-md mx-auto"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 bg-white border border-neutral-300 border-r-0 text-neutral-800 text-sm px-5 py-3 rounded-l-full focus:outline-none focus:ring-2 focus:ring-neutral-300 placeholder:text-neutral-400 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold rounded-r-full transition-all active:scale-[0.97]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />

      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <SuggestPromptModal isOpen={isSuggestModalOpen} onClose={() => setIsSuggestModalOpen(false)} />
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        platforms={PLATFORMS}
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        getCategoryIcon={getCategoryIcon}
        recentlyViewedPrompts={recentlyViewedPrompts}
        favoritedPrompts={favoritedPrompts}
        favorites={favorites}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
