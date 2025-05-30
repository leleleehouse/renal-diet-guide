import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function formatMarkdown(content: string) {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ node, ...props }: { node?: any; [key: string]: any }) => (
          <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
        ),
        h2: ({ node, ...props }: { node?: any; [key: string]: any }) => (
          <h2 className="text-lg font-semibold mt-4 mb-1" {...props} />
        ),
        h3: ({ node, ...props }: { node?: any; [key: string]: any }) => (
          <h3 className="text-base font-medium mt-3" {...props} />
        ),
        p: ({ node, ...props }: { node?: any; [key: string]: any }) => <p className="my-1 leading-relaxed" {...props} />,
        ul: ({ node, ...props }: { node?: any; [key: string]: any }) => <ul className="list-disc ml-5 my-1" {...props} />,
        li: ({ node, ...props }: { node?: any; [key: string]: any }) => <li className="my-0.5" {...props} />,
        strong: ({ node, ...props }: { node?: any; [key: string]: any }) => <strong className="font-semibold" {...props} />,
      }}
    />
  );
}