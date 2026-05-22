"use client";

import { motion } from "framer-motion";
import { Copy, Check, Heart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Prompt } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { useFavorites, useRecentlyViewed } from "@/lib/favorites";
import Link from "next/link";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
}

// Pastel badge colours per category
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

export function PromptCard({ prompt, index }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { trackView } = useRecentlyViewed();
  const isFav = isFavorite(prompt.slug);

  const footerTag = prompt.tags?.length
    ? prompt.tags.slice(0, 2).join(" / ").toUpperCase()
    : prompt.category.toUpperCase();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("Copied to clipboard", {
      description: "Code successfully copied to your clipboard.",
      icon: <Check className="w-4 h-4 text-emerald-500" />,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(prompt.slug);
    toast.success(isFav ? "Removed from favorites" : "Added to favorites", {
      description: isFav
        ? "Prompt removed from your favorites."
        : "Prompt saved to your favorites.",
    });
  };

  return (
    <Link href={`/prompt/${prompt.slug}`} className="block" onClick={() => trackView(prompt.slug)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
        className="prompt-card group relative flex flex-col bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 h-full"
      >
        {/* ── Top row: badge + heart ── */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[12px] font-semibold capitalize",
            getBadge(prompt.category)
          )}>
            {prompt.category}
          </span>

          <button
            onClick={handleFavorite}
            className={cn(
              "p-1.5 rounded-lg transition-colors focus:outline-none",
              isFav ? "text-rose-500" : "text-neutral-300 hover:text-rose-400"
            )}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-4 h-4", isFav && "fill-current")} />
          </button>
        </div>

        {/* ── Title ── */}
        <h3
          className="font-display font-black uppercase text-neutral-900 leading-tight mb-2.5 flex-1"
          style={{ fontSize: "clamp(17px, 2.2vw, 21px)" }}
        >
          {prompt.title}
        </h3>

        {/* ── Description ── */}
        <p className="text-[13px] text-neutral-500 leading-relaxed line-clamp-2 mb-5">
          {prompt.description}
        </p>

        {/* ── Tags ── */}
        {prompt.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {prompt.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[11px] font-mono text-neutral-400">
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[11px] font-mono text-neutral-300">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
            {footerTag}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none"
              aria-label="Copy prompt"
            >
              {copied
                ? <Check className="w-3.5 h-3.5 text-green-600" />
                : <Copy className="w-3.5 h-3.5" />}
            </button>
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
