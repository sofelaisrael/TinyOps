"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Heart, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReactNode, useRef, useEffect } from "react";
import Link from "next/link";
import { type Prompt } from "@/lib/mdx";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: string[];
  selectedPlatform: string | null;
  onSelectPlatform: (p: string | null) => void;
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (c: string | null) => void;
  getCategoryIcon: (cat: string) => ReactNode;
  recentlyViewedPrompts: Prompt[];
  favoritedPrompts: Prompt[];
  favorites: string[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function MobileFilterDrawer({
  isOpen, onClose,
  platforms, selectedPlatform, onSelectPlatform,
  categories, selectedCategory, onSelectCategory,
  getCategoryIcon,
  recentlyViewedPrompts, favoritedPrompts, favorites,
  searchQuery, onSearchChange,
}: MobileFilterDrawerProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 300);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#EDEBE7] border-r border-neutral-200/80 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-200/80">
              <span className="text-[13px] font-semibold text-neutral-700">Filters</span>
              <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-white/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 pt-4 pb-2 border-b border-neutral-200/80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery || ""}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg text-[13px] text-neutral-800 placeholder:text-neutral-400 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
                />
              </div>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Platform</p>
                <ul className="space-y-2">
                  {platforms.map((p) => (
                    <li key={p}>
                      <button
                        onClick={() => { onSelectPlatform(selectedPlatform === p ? null : p); onClose(); }}
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
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Categories</p>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => { onSelectCategory(null); onClose(); }}
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
                        onClick={() => { onSelectCategory(selectedCategory === cat ? null : cat); onClose(); }}
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

              {recentlyViewedPrompts.length > 0 && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Recently Viewed
                  </p>
                  <ul className="space-y-2">
                    {recentlyViewedPrompts.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/prompt/${p.slug}`}
                          onClick={onClose}
                          className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors line-clamp-1"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {favoritedPrompts.length > 0 && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                    <Heart className="w-3 h-3" />
                    Favorites
                  </p>
                  <ul className="space-y-2">
                    {favoritedPrompts.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/prompt/${p.slug}`}
                          onClick={onClose}
                          className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors line-clamp-1"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                    {favorites.length > 5 && (
                      <li>
                        <Link
                          href="/favorites"
                          onClick={onClose}
                          className="text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
                        >
                          View all {favorites.length}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function MobileFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 text-neutral-600 text-[13px] font-medium hover:border-neutral-400 hover:text-neutral-800 transition-all"
    >
      <SlidersHorizontal className="w-3.5 h-3.5" />
      <span className="hidden sm:block">Filters</span>
    </button>
  );
}
