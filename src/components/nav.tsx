"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Palette, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/articles", label: "articles" },
  { href: "/projects", label: "projects" },
  { href: "/snippets", label: "snippets" },
  { href: "/playground", label: "playground" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openPanel } = useTheme();

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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          scrolled
            ? "border-b border-surface-0 bg-base/90 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
          <Link href="/" className="text-sm text-peach">
            elliot<span className="animate-cursor">_</span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-text"
                      : "text-overlay-1 hover:text-subtext-1"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {/* Search button */}
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-search"))
              }
              className="group flex items-center gap-2 rounded p-1.5 text-overlay-1 hover:text-peach transition-colors"
              aria-label="Search"
              title="Search (⌘K)"
            >
              <Search size={15} />
              <kbd className="hidden rounded px-1.5 py-0.5 text-[10px] text-overlay-0 bg-surface-0 sm:inline-block group-hover:text-peach">
                ⌘K
              </kbd>
            </button>

            {/* Theme picker button */}
            <button
              onClick={openPanel}
              className="rounded p-1.5 text-overlay-1 hover:text-peach transition-colors"
              aria-label="Open theme picker"
              title="Change theme"
            >
              <Palette size={16} />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded p-1.5 text-overlay-1 hover:text-text transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed top-14 left-0 right-0 z-40 border-b border-surface-0 bg-base md:hidden">
          <nav className="mx-auto max-w-2xl flex flex-col px-6 py-4 gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm py-1 transition-colors",
                    isActive
                      ? "text-text"
                      : "text-overlay-1 hover:text-subtext-1"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
