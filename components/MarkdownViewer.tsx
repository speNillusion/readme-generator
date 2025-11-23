import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { customTheme } from './codeTheme';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="markdown-body text-gray-300 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={customTheme}
                language={match[1]}
                PreTag="div"
                className="rounded-lg border border-cyber-700 !bg-cyber-900 !m-0"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className="bg-cyber-700 text-neon-pink px-1 py-0.5 rounded font-mono text-sm">
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold text-neon-blue border-b border-cyber-600 pb-2 mb-4 mt-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-cyber-300 mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold text-cyber-100 mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-gray-300">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 ml-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 ml-4">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline">{children}</a>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-neon-purple pl-4 italic bg-cyber-800 py-2 my-4 rounded-r">{children}</blockquote>,
          table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="min-w-full border-collapse border border-cyber-700">{children}</table></div>,
          thead: ({ children }) => <thead className="bg-cyber-800">{children}</thead>,
          tbody: ({ children }) => <tbody className="bg-cyber-900/50">{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-cyber-700 hover:bg-cyber-800/50 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-2 text-left text-neon-blue font-semibold border-r border-cyber-700 last:border-r-0">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2 border-r border-cyber-700 last:border-r-0">{children}</td>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};