const WORKER_SOURCE = `
"use strict";

let tsLib = null;

async function loadTypeScript() {
  if (tsLib) return tsLib;
  importScripts("https://cdn.jsdelivr.net/npm/typescript@5/lib/typescript.min.js");
  tsLib = self.ts;
  return tsLib;
}

function captureConsole(fn) {
  const output = [];
  const orig = { log: console.log, warn: console.warn, error: console.error, info: console.info };

  const capture = (level) => (...args) => {
    const text = args.map(a => {
      if (a === null) return "null";
      if (a === undefined) return "undefined";
      if (typeof a === "object") {
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
      }
      return String(a);
    }).join(" ");
    output.push({ level, text });
  };

  console.log = capture("log");
  console.warn = capture("warn");
  console.error = capture("error");
  console.info = capture("info");

  try {
    fn();
  } finally {
    Object.assign(console, orig);
  }
  return output;
}

self.onmessage = async (e) => {
  const { code, language, id } = e.data;

  try {
    let execCode = code;

    if (language === "typescript") {
      const ts = await loadTypeScript();
      const result = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.None,
          strict: false,
        },
      });
      execCode = result.outputText;
    }

    const output = captureConsole(() => {
      const fn = new Function(execCode);
      fn();
    });

    self.postMessage({ id, success: true, output });
  } catch (err) {
    self.postMessage({
      id,
      success: false,
      output: [{ level: "error", text: err.message || String(err) }],
    });
  }
};
`;

let worker: Worker | null = null;
let messageId = 0;

function getWorker(): Worker {
  if (!worker) {
    const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
    worker = new Worker(URL.createObjectURL(blob));
  }
  return worker;
}

export interface OutputLine {
  level: "log" | "warn" | "error" | "info";
  text: string;
}

export interface ExecutionResult {
  success: boolean;
  output: OutputLine[];
}

export function executeInWorker(
  code: string,
  language: "javascript" | "typescript"
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const w = getWorker();
    const id = ++messageId;

    const timeout = setTimeout(() => {
      worker?.terminate();
      worker = null;
      resolve({
        success: false,
        output: [{ level: "error", text: "Execution timed out (10s limit)" }],
      });
    }, 10_000);

    const handler = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      clearTimeout(timeout);
      w.removeEventListener("message", handler);
      resolve(e.data as ExecutionResult);
    };

    w.addEventListener("message", handler);
    w.postMessage({ code, language, id });
  });
}

export function terminateWorker() {
  worker?.terminate();
  worker = null;
}
