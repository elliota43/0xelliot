import { executeInWorker, type OutputLine, type ExecutionResult } from "./worker";

export type Language = "javascript" | "typescript" | "c" | "rust" | "go";

export type { OutputLine, ExecutionResult };

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "c", label: "C" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
];

export const DEFAULT_CODE: Record<Language, string> = {
  javascript: `// JavaScript playground
const greet = (name) => \`hello, \${name}!\`;

console.log(greet("world"));
console.log("2 + 2 =", 2 + 2);
`,
  typescript: `// TypeScript playground
interface User {
  name: string;
  age: number;
}

const greet = (user: User): string =>
  \`hello, \${user.name}! you are \${user.age} years old.\`;

console.log(greet({ name: "elliot", age: 25 }));
`,
  c: `#include <stdio.h>

int main() {
    printf("hello, world!\\n");

    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum += i;
    }
    printf("sum of 1..10 = %d\\n", sum);

    return 0;
}
`,
  rust: `fn main() {
    let name = "world";
    println!("hello, {}!", name);

    let sum: i32 = (1..=10).sum();
    println!("sum of 1..10 = {}", sum);
}
`,
  go: `package main

import "fmt"

func main() {
    name := "world"
    fmt.Printf("hello, %s!\\n", name)

    sum := 0
    for i := 1; i <= 10; i++ {
        sum += i
    }
    fmt.Printf("sum of 1..10 = %d\\n", sum)
}
`,
};

export async function execute(
  language: Language,
  code: string
): Promise<ExecutionResult> {
  if (language === "javascript" || language === "typescript") {
    return executeInWorker(code, language);
  }

  try {
    const res = await fetch("/api/playground", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code }),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        success: false,
        output: [{ level: "error", text: `Server error: ${text}` }],
      };
    }

    return (await res.json()) as ExecutionResult;
  } catch (err) {
    return {
      success: false,
      output: [
        {
          level: "error",
          text: `Network error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
  }
}
