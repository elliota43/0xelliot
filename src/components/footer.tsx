import Link from "next/link";

const links = [
  { href: "/articles", label: "articles" },
  { href: "/projects", label: "projects" },
  { href: "/snippets", label: "snippets" },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-0 py-8 mt-8">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-sm text-overlay-1">
          <div className="flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-subtext-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/elliota43"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-subtext-1 transition-colors"
            >
              github
            </a>
            <a
              href="mailto:hello@elliotanderson.dev"
              className="hover:text-subtext-1 transition-colors"
            >
              email
            </a>
          </div>

          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
