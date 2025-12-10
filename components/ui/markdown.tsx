"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm prose-green max-w-none"
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="text-lg font-bold text-green-900 mt-4 mb-2"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="text-base font-bold text-green-800 mt-3 mb-2"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="text-sm font-bold text-green-700 mt-2 mb-1"
            {...props}
          />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-green-900" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside space-y-1 my-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside space-y-1 my-2" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-green-700" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-2 text-green-700" {...props} />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-green-100 text-green-800 px-1 rounded text-xs"
              {...props}
            />
          ) : (
            <code
              className="block bg-green-100 text-green-800 p-2 rounded text-xs my-2"
              {...props}
            />
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
