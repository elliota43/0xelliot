import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 font-mono text-6xl font-bold text-[#1c1f2e]">404</div>
      <div className="mb-2 font-mono text-lg text-[#e4e6f0]">
        <span className="text-[#7effa0]">Error:</span> not found
      </div>
      <p className="mb-8 text-sm text-[#6b6f88]">
        This path doesn&apos;t exist in the filesystem.
      </p>
      <Link
        href="/"
        className="rounded-md border border-[#1c1f2e] bg-[#0d0f16] px-4 py-2 font-mono text-sm text-[#6b6f88] transition-all duration-200 hover:border-[#7effa030] hover:text-[#7effa0]"
      >
        cd ~/home
      </Link>
    </div>
  );
}
