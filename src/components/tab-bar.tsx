"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Tab {
  key: string;
  label: string;
  disabled?: boolean;
  badge?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex gap-1 border-b border-neutral-200 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => !tab.disabled && onTabChange(tab.key)}
          disabled={tab.disabled}
          className={cn(
            "relative px-4 py-3 text-[13px] font-semibold transition-colors",
            tab.disabled
              ? "text-neutral-300 cursor-not-allowed"
              : activeTab === tab.key
                ? "text-neutral-900"
                : "text-neutral-400 hover:text-neutral-700"
          )}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.badge && (
              <span className="text-[10px] font-mono bg-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded-full">
                {tab.badge}
              </span>
            )}
            {tab.disabled && (
              <span className="text-[9px] font-mono text-neutral-300 uppercase tracking-wider">
                Soon
              </span>
            )}
          </span>
          {activeTab === tab.key && !tab.disabled && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
