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

interface FigureProps {
  src: string;
  alt?: string;
  caption?: string;
  /** Constrain to a max pixel width, e.g. 480 for a half-width diagram */
  width?: number;
}

interface CodeFigureProps {
  children: React.ReactNode;
  caption?: string;
}

interface TableFigureProps {
  children: React.ReactNode;
  caption?: string;
}

function Figure({ src, alt, caption, width }: FigureProps) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? caption ?? ""}
        className="prose-media rounded border border-surface-0 max-w-full h-auto"
        style={width ? { maxWidth: width } : undefined}
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-overlay-1 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function CodeFigure({ children, caption }: CodeFigureProps) {
  return (
    <figure className="my-8">
      {children}
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-overlay-1 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function TableFigure({ children, caption }: TableFigureProps) {
  return (
    <figure className="my-8 [&>div]:my-0">
      {children}
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-overlay-1 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface VideoProps {
  src: string;
  caption?: string;
  /** Loop the video silently, useful for short demos */
  loop?: boolean;
  autoplay?: boolean;
}

function Video({ src, caption, loop = false, autoplay = false }: VideoProps) {
  return (
    <figure className="my-8">
      <video
        src={src}
        controls={!autoplay}
        loop={loop}
        autoPlay={autoplay}
        muted={autoplay}
        playsInline
        className="prose-media rounded border border-surface-0 max-w-full w-full"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-overlay-1 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const mdxComponents = {
  pre: CodeBlock,
  // Bare markdown images: ![alt](/media/foo.png)
  img: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="prose-media rounded border border-surface-0 max-w-full h-auto my-6"
      {...props}
    />
  ),
  // Named components available as <Figure> / <Video> in MDX
  CodeFigure,
  Figure,
  TableFigure,
  Video,
  a: (props: any) => (
    <a
      className="text-peach underline underline-offset-3 decoration-peach/30 hover:decoration-peach transition-colors"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="my-8 border-l-2 border-peach/80 pl-5 text-subtext-0 italic"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm leading-6" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-surface-0 bg-mantle px-4 py-2.5 text-left text-xs font-medium tracking-wide text-subtext-1"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border border-surface-0 px-4 py-3 align-top text-subtext-0"
      {...props}
    />
  ),
};
