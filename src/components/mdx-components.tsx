import { CopyButton } from "./copy-button";

/* eslint-disable @typescript-eslint/no-explicit-any */

function CodeBlock({ children, ...props }: any) {
  const getTextContent = (node: any): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (node?.props?.children) return getTextContent(node.props.children);
    return "";
  };

  const text = getTextContent(children);

  return (
    <div className="relative group">
      <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <CopyButton text={text} />
      </div>
      <pre {...props}>{children}</pre>
    </div>
  );
}

export const mdxComponents = {
  pre: CodeBlock,
  a: (props: any) => (
    <a
      className="text-peach underline underline-offset-3 decoration-peach/30 hover:decoration-peach transition-colors"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-2 border-peach pl-5 my-6 text-subtext-0 italic"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-surface-0 bg-mantle px-4 py-2 text-left text-subtext-1 font-medium"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border border-surface-0 px-4 py-2 text-subtext-0"
      {...props}
    />
  ),
};
