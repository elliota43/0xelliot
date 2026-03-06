import { Suspense } from "react";
import { PlaygroundClient } from "@/components/playground-client";

export const metadata = {
  title: "Playground",
  description:
    "Write and run JavaScript, TypeScript, C, Rust, and Go code in the browser.",
};

export default function PlaygroundPage() {
  return (
    <Suspense>
      <PlaygroundClient />
    </Suspense>
  );
}
