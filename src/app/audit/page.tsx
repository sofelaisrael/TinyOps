"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  GitBranch,
  Shield,
  Box,
  Server,
  FileCheck,
  Mail,
  Loader2,
  ArrowRight,
  CircleAlert,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

// ── Types ──
interface AuditCategory {
  name: string;
  score: number;
  maxScore: number;
}

interface AuditIssue {
  name: string;
  recommendation: string;
}

interface AuditResults {
  success: boolean;
  score: number;
  maxScore: number;
  grade: string;
  categories: AuditCategory[];
  issues: AuditIssue[];
  repoUrl: string;
}

// ── Category icons ──
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "ci/cd": <GitBranch className="w-4 h-4" />,
  "infrastructure": <Server className="w-4 h-4" />,
  "docker": <Box className="w-4 h-4" />,
  "security": <Shield className="w-4 h-4" />,
  "compliance": <FileCheck className="w-4 h-4" />,
};

function getCategoryIcon(name: string) {
  return CATEGORY_ICONS[name.toLowerCase()] ?? <GitBranch className="w-4 h-4" />;
}

// ── Grade helpers ──
function getGradeColor(grade: string): string {
  switch (grade) {
    case "Critical": return "bg-red-500";
    case "Needs Work": return "bg-amber-500";
    case "Good": return "bg-emerald-500";
    case "Excellent": return "bg-emerald-600";
    default: return "bg-neutral-400";
  }
}

function getGradeTextColor(grade: string): string {
  switch (grade) {
    case "Critical": return "text-red-600";
    case "Needs Work": return "text-amber-600";
    case "Good": return "text-emerald-600";
    case "Excellent": return "text-emerald-700";
    default: return "text-neutral-600";
  }
}

function getScorePercent(score: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((score / max) * 100);
}

// ── Animation variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function AuditPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AuditResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleAudit = async () => {
    if (!repoUrl.trim()) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Audit failed");
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#EDEBE7]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-[#EDEBE7] border-b border-neutral-200/80">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center gap-4">
          <Logo />
          <div className="ml-auto">
            <a
              href="/"
              className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Browse Prompts
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="font-display font-black uppercase text-neutral-900 leading-none tracking-tight mb-4"
          style={{ fontSize: "clamp(40px, 7vw, 64px)" }}
        >
          Audit Your Repo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-neutral-500 text-[15px] mb-8 max-w-md mx-auto"
        >
          Enter a GitHub URL to check your DevOps setup against best practices.
        </motion.p>

        {/* ── Input form ── */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
          onSubmit={(e) => {
            e.preventDefault();
            handleAudit();
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="url"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-white rounded-full border border-neutral-200 text-[14px] text-neutral-800 placeholder:text-neutral-400 pl-11 pr-4 py-3 transition-shadow focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !repoUrl.trim()}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold transition-all active:scale-[0.97] shrink-0",
              isLoading || !repoUrl.trim()
                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-700"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                Audit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>
      </section>

      {/* ── Error state ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-lg mx-auto px-6 mb-8"
          >
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
              <CircleAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading skeleton ── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto px-6 pb-20"
          >
            <div className="space-y-4">
              <div className="h-32 rounded-2xl bg-white/60 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-white/60 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/60 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence>
        {results && !isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto px-6 pb-20"
          >
            {/* ── Overall score card ── */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    Overall Score
                  </p>
                  <p className="font-display font-black text-neutral-900 text-3xl leading-none">
                    {results.score}
                    <span className="text-neutral-300 text-xl">/{results.maxScore}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    Grade
                  </p>
                  <p className={cn(
                    "font-display font-black text-2xl leading-none uppercase",
                    getGradeTextColor(results.grade)
                  )}>
                    {results.grade}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getScorePercent(results.score, results.maxScore)}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                  className={cn("h-full rounded-full", getGradeColor(results.grade))}
                />
              </div>
              <p className="text-[12px] text-neutral-400 mt-2 text-right">
                {getScorePercent(results.score, results.maxScore)}%
              </p>
            </motion.div>

            {/* ── Category cards ── */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {results.categories.map((cat) => {
                const pct = getScorePercent(cat.score, cat.maxScore);
                return (
                  <div
                    key={cat.name}
                    className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-neutral-400">{getCategoryIcon(cat.name)}</span>
                      <span className="text-[12px] font-bold uppercase tracking-widest text-neutral-500">
                        {cat.name}
                      </span>
                    </div>
                    <p className="font-display font-black text-neutral-900 text-xl leading-none mb-3">
                      {cat.score}
                      <span className="text-neutral-300 text-sm">/{cat.maxScore}</span>
                    </p>
                    <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                        className={cn(
                          "h-full rounded-full",
                          pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* ── Issues list ── */}
            {results.issues.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="font-display font-black uppercase text-neutral-900 text-lg leading-none tracking-tight mb-4">
                  Issues
                </h2>
                <div className="space-y-2">
                  {results.issues.map((issue, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[14px] font-semibold text-neutral-900 mb-0.5">
                          {issue.name}
                        </p>
                        <p className="text-[13px] text-neutral-500 leading-relaxed">
                          {issue.recommendation}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── All checks passed ── */}
            {results.issues.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 text-center"
              >
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="font-display font-black uppercase text-neutral-900 text-lg mb-1">
                  All Checks Passed
                </p>
                <p className="text-[13px] text-neutral-500">
                  Your repo looks great. No critical issues found.
                </p>
              </motion.div>
            )}

            {/* ── Email capture ── */}
            <motion.div variants={itemVariants} className="mt-10">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <p className="text-[12px] font-bold uppercase tracking-widest text-neutral-400">
                    Get the Full Report
                  </p>
                </div>
                <p className="text-[13px] text-neutral-500 mb-4">
                  Enter your email to receive the full report with fix templates and step-by-step guides.
                </p>

                <AnimatePresence mode="wait">
                  {emailSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-emerald-600 text-[13px] font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Check your inbox for the full report.
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleEmailSubmit}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-white rounded-full border border-neutral-200 text-[13px] text-neutral-800 placeholder:text-neutral-400 px-4 py-2.5 transition-shadow focus:outline-none focus:ring-2 focus:ring-neutral-300"
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-semibold hover:bg-neutral-700 transition-all active:scale-[0.97] shrink-0"
                      >
                        Get Full Report
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
