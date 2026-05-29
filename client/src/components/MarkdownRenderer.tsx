'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-cyber max-w-none
                    prose-headings:text-text-primary
                    prose-p:text-text-secondary prose-p:leading-relaxed
                    prose-a:text-accent-green prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-text-primary
                    prose-code:text-accent-blue prose-code:bg-cyber-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-cyber-surface prose-pre:border prose-pre:border-cyber-border prose-pre:rounded-xl
                    prose-blockquote:border-l-accent-green prose-blockquote:bg-accent-green/5 prose-blockquote:rounded-r-lg
                    prose-table:text-text-secondary
                    prose-th:text-text-primary prose-th:bg-cyber-surface
                    prose-td:border-cyber-border
                    prose-img:rounded-xl prose-img:border prose-img:border-cyber-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
