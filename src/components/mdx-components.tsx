import { CopyButton } from "./copy-button";

/* eslint-disable @typescript-eslint/no-explicit-any */

function CodeBlock({ children, ...props }: any) {
  // Extract text content for copy
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
  h1: (props: any) => <h1 className="text-gradient" {...props} />,
  a: (props: any) => (
    <a
      className="text-[#7effa0] border-b border-[#7effa030] hover:border-[#7effa080] transition-colors duration-200 no-underline"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-2 border-[#7effa040] pl-6 my-8 text-[#8b8fa8] italic"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table
        className="w-full border-collapse font-mono text-sm"
        {...props}
      />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-[#1c1f2e] bg-[#141720] px-4 py-2 text-left text-[#7effa0] font-medium"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border border-[#1c1f2e] px-4 py-2 text-[#b8bbcc]"
      {...props}
    />
  ),
};
