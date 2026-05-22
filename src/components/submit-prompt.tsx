"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SubmitPrompt() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button render={<span />} nativeButton={false} variant="outline" size="sm" className="bg-white border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:border-neutral-500 h-9">
            <Plus className="w-4 h-4 mr-1.5" />
            Submit Prompt
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-white border-neutral-200 text-neutral-900">
        <DialogHeader>
          <DialogTitle>Submit a Prompt</DialogTitle>
          <DialogDescription className="text-neutral-500">
            Share your battle-tested Vercel or GitHub Actions prompt. The best way to contribute is via a <a href="https://github.com/yourusername/tinyops/issues/new" target="_blank" className="text-neutral-700 underline underline-offset-4 hover:text-neutral-900">GitHub Issue</a>.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="text-emerald-600 font-medium">Thank you for your submission!</div>
            <p className="text-sm text-neutral-500 text-balance">Our team will review your prompt and add it to the library soon.</p>
            <Button variant="outline" className="mt-4 border-neutral-300 text-neutral-500 hover:text-neutral-900" onClick={() => setSubmitted(false)}>
              Submit another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-neutral-600">Prompt Title</Label>
              <Input id="title" placeholder="Title of your prompt" className="bg-white border-neutral-300 focus-visible:ring-neutral-400" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-neutral-600">Category</Label>
              <Input id="category" placeholder="Testing" className="bg-white border-neutral-300 focus-visible:ring-neutral-400" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-neutral-600">Prompt Content</Label>
              <Textarea id="content" placeholder="Paste the prompt text here..." className="bg-white border-neutral-300 focus-visible:ring-neutral-400 min-h-[120px]" required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-neutral-900 text-white hover:bg-neutral-700 w-full sm:w-auto font-medium">
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
