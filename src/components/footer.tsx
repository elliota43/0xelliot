"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";

const links = [
  { href: "/articles", label: "articles" },
  { href: "/projects", label: "projects" },
  { href: "/snippets", label: "snippets" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1c1f2e] py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.a
              href="https://github.com/elliota43"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1 }}
              className="text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
              aria-label="GitHub"
            >
              <Github size={15} />
            </motion.a>
            <motion.a
              href="mailto:hello@elliotanderson.dev"
              whileHover={{ y: -1 }}
              className="text-[#363a50] transition-colors duration-200 hover:text-[#7effa0]"
              aria-label="Email"
            >
              <Mail size={15} />
            </motion.a>
          </div>

          <p className="font-mono text-xs text-[#363a50]">
            © {new Date().getFullYear()} Elliot Anderson
          </p>
        </div>
      </div>
    </footer>
  );
}
