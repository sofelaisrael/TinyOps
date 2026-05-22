"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 pt-10 border-t border-neutral-200/80">
      <div className="max-w-md">
        <h3 className="text-sm font-semibold text-neutral-900 mb-2">
          Get weekly workflows
        </h3>
        <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
          CI/CD workflows and bash scripts delivered to your inbox every Tuesday.
        </p>

        {submitted ? (
          <div className="text-sm font-medium text-emerald-600">
            Check your inbox on Tuesday.
          </div>
        ) : (
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                required
                placeholder="Email address"
                className="h-9 text-sm bg-white border-neutral-300 text-neutral-900 focus-visible:ring-neutral-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" size="sm" className="bg-neutral-900 text-white hover:bg-neutral-700 font-medium" disabled={loading}>
                {loading ? "..." : "Join"}
              </Button>
            </form>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
