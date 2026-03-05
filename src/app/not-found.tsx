import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-semibold text-surface-1 mb-4">404</h1>
      <p className="text-sm text-subtext-1 mb-2">page not found</p>
      <p className="text-sm text-overlay-0 mb-8">
        nothing here.
      </p>
      <Link
        href="/"
        className="text-sm text-peach hover:underline"
      >
        go home
      </Link>
    </div>
  );
}
