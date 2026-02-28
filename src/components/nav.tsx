"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Terminal, FileText, Folder, Code2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "~/home", icon: Terminal },
  { href: "/articles", label: "articles", icon: FileText },
  { href: "/projects", label: "projects", icon: Folder },
  { href: "/snippets", label: "snippets", icon: Code2 },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-[#1c1f2e] bg-[#08090e]/90 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-mono text-sm text-[#7effa0] opacity-60 transition-opacity duration-200 group-hover:opacity-100">
              ▸
            </span>
            <span className="font-mono text-sm font-medium text-[#e4e6f0] transition-colors duration-200 group-hover:text-[#7effa0]">
              elliot.dev
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={isActive}
                />
              );
            })}
            <a
              href="https://github.com/elliota43"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center gap-1.5 rounded-md border border-[#1c1f2e] bg-[#0d0f16] px-3 py-1.5 font-mono text-xs text-[#6b6f88] transition-all duration-200 hover:border-[#7effa030] hover:text-[#7effa0]"
            >
              <span className="opacity-60">gh/</span>
              <span>elliota43</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-1.5 text-[#6b6f88] transition-colors hover:text-[#e4e6f0] md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 z-40 border-b border-[#1c1f2e] bg-[#08090e]/95 backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-sm transition-all duration-200",
                      isActive
                        ? "bg-[#7effa010] text-[#7effa0]"
                        : "text-[#6b6f88] hover:bg-[#0d0f16] hover:text-[#e4e6f0]"
                    )}
                  >
                    <Icon size={14} />
                    {link.label}
                  </Link>
                );
              })}
              <a
                href="https://github.com/elliota43"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-sm text-[#6b6f88] transition-all duration-200 hover:bg-[#0d0f16] hover:text-[#e4e6f0]"
              >
                <span className="text-xs opacity-60">gh/</span>
                elliota43
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link href={href} className="relative px-3 py-1.5 group">
      <span
        className={cn(
          "relative z-10 font-mono text-xs transition-colors duration-200",
          isActive ? "text-[#7effa0]" : "text-[#6b6f88] group-hover:text-[#e4e6f0]"
        )}
      >
        {label}
      </span>
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-md bg-[#7effa010]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <motion.span
        className="absolute inset-0 rounded-md bg-[#1c1f2e] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ zIndex: 0 }}
      />
    </Link>
  );
}
