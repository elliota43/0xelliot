import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 15_000;

interface PlaygroundRequest {
  language: "c" | "rust" | "go";
  code: string;
}

interface OutputLine {
  level: "log" | "warn" | "error" | "info";
  text: string;
}

interface ExecutionResult {
  success: boolean;
  output: OutputLine[];
}

async function executeRust(code: string): Promise<ExecutionResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://play.rust-lang.org/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "stable",
        mode: "debug",
        edition: "2021",
        crateType: "bin",
        tests: false,
        code,
        backtrace: false,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        success: false,
        output: [{ level: "error", text: `Rust Playground returned ${res.status}` }],
      };
    }

    const data = await res.json();
    const output: OutputLine[] = [];

    if (data.stderr) {
      for (const line of data.stderr.split("\n").filter(Boolean)) {
        output.push({ level: "error", text: line });
      }
    }
    if (data.stdout) {
      for (const line of data.stdout.split("\n")) {
        output.push({ level: "log", text: line });
      }
      if (output.length > 0 && output[output.length - 1].text === "") {
        output.pop();
      }
    }

    const hasError =
      !data.success || data.stderr?.includes("error[") || data.stderr?.includes("error:");

    return { success: !hasError, output };
  } finally {
    clearTimeout(timeout);
  }
}

async function executeGo(code: string): Promise<ExecutionResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body = new URLSearchParams();
    body.set("version", "2");
    body.set("body", code);
    body.set("withVet", "true");

    const res = await fetch("https://go.dev/_/compile", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        success: false,
        output: [{ level: "error", text: `Go Playground returned ${res.status}` }],
      };
    }

    const data = await res.json();
    const output: OutputLine[] = [];

    if (data.Errors) {
      for (const line of data.Errors.split("\n").filter(Boolean)) {
        output.push({ level: "error", text: line });
      }
      return { success: false, output };
    }

    if (data.Events) {
      for (const event of data.Events) {
        if (event.Kind === "stdout") {
          for (const line of event.Message.split("\n")) {
            output.push({ level: "log", text: line });
          }
        } else if (event.Kind === "stderr") {
          for (const line of event.Message.split("\n")) {
            output.push({ level: "error", text: line });
          }
        }
      }
      if (output.length > 0 && output[output.length - 1].text === "") {
        output.pop();
      }
    }

    return { success: true, output };
  } finally {
    clearTimeout(timeout);
  }
}

async function executeC(code: string): Promise<ExecutionResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: "gcc-head",
        code,
        options: "-Wall -Wextra",
        "compiler-option-raw": "-std=c17",
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        success: false,
        output: [{ level: "error", text: `Wandbox returned ${res.status}` }],
      };
    }

    const data = await res.json();
    const output: OutputLine[] = [];

    if (data.compiler_error) {
      for (const line of data.compiler_error.split("\n").filter(Boolean)) {
        output.push({ level: "error", text: line });
      }
    }
    if (data.compiler_message && !data.compiler_error) {
      for (const line of data.compiler_message.split("\n").filter(Boolean)) {
        output.push({ level: "warn", text: line });
      }
    }
    if (data.program_output) {
      for (const line of data.program_output.split("\n")) {
        output.push({ level: "log", text: line });
      }
      if (output.length > 0 && output[output.length - 1].text === "") {
        output.pop();
      }
    }
    if (data.program_error) {
      for (const line of data.program_error.split("\n").filter(Boolean)) {
        output.push({ level: "error", text: line });
      }
    }

    const hasError = data.status !== "0" && data.status !== 0;
    return { success: !hasError, output };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  let body: PlaygroundRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, output: [{ level: "error", text: "Invalid request body" }] },
      { status: 400 }
    );
  }

  const { language, code } = body;

  if (!language || !code) {
    return NextResponse.json(
      { success: false, output: [{ level: "error", text: "Missing language or code" }] },
      { status: 400 }
    );
  }

  if (code.length > 50_000) {
    return NextResponse.json(
      { success: false, output: [{ level: "error", text: "Code too large (50KB limit)" }] },
      { status: 400 }
    );
  }

  try {
    let result: ExecutionResult;

    switch (language) {
      case "rust":
        result = await executeRust(code);
        break;
      case "go":
        result = await executeGo(code);
        break;
      case "c":
        result = await executeC(code);
        break;
      default:
        return NextResponse.json(
          { success: false, output: [{ level: "error", text: `Unsupported language: ${language}` }] },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === "AbortError"
        ? "Execution timed out"
        : `Internal error: ${err instanceof Error ? err.message : String(err)}`;

    return NextResponse.json(
      { success: false, output: [{ level: "error", text: message }] },
      { status: 500 }
    );
  }
}
