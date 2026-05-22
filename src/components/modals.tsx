"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, Command, Keyboard, FileCode, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { type Prompt } from "@/lib/mdx";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function ModalLayout({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative z-10 w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl",
              className
            )}
          >
            {children}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 1. Quick Preview Modal
export function PreviewModal({ prompt, isOpen, onClose, onShare }: { prompt: Prompt | null; isOpen: boolean; onClose: () => void; onShare: () => void; }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!prompt) return null;

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="mb-6 pr-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-neutral-100 border border-neutral-200 text-neutral-700">
            {prompt.category}
          </span>
          <span className="text-sm text-neutral-400 font-medium">{new Date(prompt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">{prompt.title}</h2>
        <p className="text-neutral-600">{prompt.description}</p>
      </div>

      <div className="relative group rounded-xl overflow-hidden bg-neutral-950 border border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-300" />
            <div className="w-3 h-3 rounded-full bg-neutral-300" />
            <div className="w-3 h-3 rounded-full bg-neutral-300" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onShare}
              className="flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-md border border-neutral-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-md border border-neutral-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </div>
        <pre className="p-4 overflow-auto max-h-[50vh] text-sm font-mono text-neutral-300">
          <code>{prompt.content}</code>
        </pre>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompt.files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5" />
              Files affected
            </h3>
            <div className="space-y-1">
              {prompt.files.map(file => (
                <div key={file} className="font-mono text-[11px] text-neutral-600 bg-neutral-50 border border-neutral-200 px-2 py-1.5 rounded break-all">
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}

        {prompt.secrets.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              Required Secrets
            </h3>
            <div className="flex flex-wrap gap-2">
              {prompt.secrets.map(secret => (
                <span key={secret} className="text-[10px] font-bold font-mono bg-neutral-100 text-neutral-600 border border-neutral-200 px-1.5 py-0.5 rounded uppercase">
                  {secret}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalLayout>
  );
}

// 2. Share Modal
export function ShareModal({ isOpen, onClose, prompt }: { isOpen: boolean; onClose: () => void, prompt?: Prompt | null }) {
  const [copiedLink, setCopiedLink] = useState(false);

  const url = typeof window !== 'undefined' ? `${window.location.origin}/prompt/${prompt?.slug || ''}` : 'https://tinyops.vercel.app';

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4 border border-neutral-200">
          <Share2 className="w-6 h-6 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Share Prompt</h2>
        <p className="text-neutral-500 text-sm">Spread the word with your team or followers.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent px-2 text-sm text-neutral-500 font-mono focus:outline-none truncate"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors flex items-center gap-2 shrink-0"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this CI/CD prompt: ${prompt?.title}`)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-neutral-900"
          >
            <span className="text-sm font-medium">Twitter / X</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-neutral-900"
          >
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
        </div>
      </div>
    </ModalLayout>
  );
}

// 3. Shortcuts Modal (redesigned)
export function ShortcutsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const shortcuts = [
    { keys: ['⌘', 'K'], label: 'Search prompts', desc: 'Jump to the search bar instantly' },
    { keys: ['ESC'], label: 'Close / Clear', desc: 'Close modals or clear search' },
    { keys: ['?'], label: 'Keyboard shortcuts', desc: 'Toggle this help window' },
  ];

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="relative mb-6">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-neutral-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-3 relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center shadow-sm">
            <Keyboard className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Keyboard Shortcuts</h2>
            <p className="text-sm text-neutral-500">Navigate TinyOps like a pro.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-colors">
            <div>
              <span className="text-sm font-medium text-neutral-800">{shortcut.label}</span>
              <p className="text-[12px] text-neutral-400 mt-0.5">{shortcut.desc}</p>
            </div>
            <div className="flex gap-1">
              {shortcut.keys.map((k, ki) => (
                <span key={ki}>
                  <kbd className="min-w-[30px] h-7 px-2 inline-flex items-center justify-center text-xs font-mono font-bold bg-white border border-neutral-200 text-neutral-700 rounded-lg shadow-sm">{k}</kbd>
                  {ki < shortcut.keys.length - 1 && <span className="text-neutral-300 mx-0.5 text-xs">+</span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalLayout>
  );
}
