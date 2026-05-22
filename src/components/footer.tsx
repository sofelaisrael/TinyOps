export function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white/40 py-12 mt-20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[13px] text-neutral-400">
          © {new Date().getFullYear()} TinyOps. Open Source Prompt Library.
        </p>
        <div className="flex gap-8 text-[13px] text-neutral-400">
          <a href="https://github.com/yourusername/tinyops" target="_blank" className="hover:text-neutral-700 transition-colors">GitHub</a>
          <a href="https://x.com/yourhandle" target="_blank" className="hover:text-neutral-700 transition-colors">Twitter</a>
          <a href="mailto:hello@tinyops.dev" className="hover:text-neutral-700 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
