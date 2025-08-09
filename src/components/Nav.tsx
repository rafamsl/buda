"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="w-full border-b border-black/10 dark:border-white/10 bg-background">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">BodhiBuddy</Link>
        <button aria-label="Toggle menu" className="sm:hidden p-2" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <div className="hidden sm:flex gap-4">
          <Link href="/learning" className="hover:underline">Learning Hub</Link>
          <Link href="/practice" className="hover:underline">Practice Lab</Link>
          <Link href="/integration" className="hover:underline">Integration</Link>
          <Link href="/admin" className="hover:underline">Admin</Link>
        </div>
      </div>
      {open && (
        <div className="sm:hidden px-4 pb-3 flex flex-col gap-2">
          <Link href="/learning" onClick={() => setOpen(false)}>Learning Hub</Link>
          <Link href="/practice" onClick={() => setOpen(false)}>Practice Lab</Link>
          <Link href="/integration" onClick={() => setOpen(false)}>Integration</Link>
          <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
        </div>
      )}
    </nav>
  );
} 