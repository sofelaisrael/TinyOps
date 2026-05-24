"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SuggestPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Deployment",
  "Testing",
  "Security",
  "Database",
  "Notifications",
  "Monorepo",
  "Performance",
  "Advanced CI/CD",
];

export function SuggestPromptModal({ isOpen, onClose }: SuggestPromptModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a prompt title");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, email }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Prompt suggestion submitted!", {
        description: "Thank you! Your suggestion has been received and will be reviewed.",
        icon: <Bot className="w-4 h-4 text-neutral-900" />
      });

      setTitle("");
      setDescription("");
      setCategory("");
      setEmail("");
      onClose();

    } catch {
      toast.error("Failed to submit suggestion", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-neutral-50 to-white px-6 pt-6 pb-5 border-b border-neutral-100">
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center">
                      <Bot className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                        Suggest a Prompt
                      </h2>
                      <p className="text-sm text-neutral-500">Got an idea for a new prompt?</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-white/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Prompt Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Multi-Environment Deployments"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all text-[14px]"
                  />
                </div>

                <div className="relative" ref={categoryRef}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] text-left focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                  >
                    <span className={category ? "text-neutral-900" : "text-neutral-400"}>
                      {category || "Select a category..."}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isCategoryOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                      >
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => { setCategory(cat); setIsCategoryOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
                          >
                            {cat}
                            {category === cat && <Check className="w-4 h-4 text-amber-500" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com (optional)"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    What should this prompt do?
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this prompt should help users accomplish..."
                    rows={4}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all resize-none text-[14px]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Suggestion
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-neutral-400 text-center pt-1">
                  Your suggestion will be reviewed by our team.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
