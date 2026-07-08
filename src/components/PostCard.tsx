import { useState, useEffect, useRef } from 'react';
import type { BlogPost } from '../types/blog';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // LaTeX Math Symbol Engine
  const MathRenderer = ({ formula, displayMode = false }: { formula: string; displayMode?: boolean }) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        try {
          katex.render(formula, containerRef.current, {
            displayMode: displayMode,
            throwOnError: false,
          });
        } catch (err) {
          console.error("KaTeX error:", err);
        }
      }
    }, [formula, displayMode]);

    return <span ref={containerRef} />;
  };

  // Helper to parse a text segment for inline math ($...$) AND bold markdown (**...**)
  const renderInlineStyles = (text: string) => {
    // Step 1: Split by inline math markers first
    const mathParts = text.split(/(\$[^\$]+\$)/g);

    return mathParts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1);
        return <MathRenderer key={`math-${index}`} formula={formula} displayMode={false} />;
      }

      // Step 2: For non-math text segments, split by bold markdown markers (**text**)
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          const boldText = subPart.slice(2, -2);
          return <strong key={`bold-${index}-${subIndex}`} className="font-extrabold text-white bg-slate-900/40 px-1 py-0.5 rounded border border-slate-800/40">{boldText}</strong>;
        }
        return subPart;
      });
    });
  };

  const normalizeInlineHtml = (text: string) => {
    return text
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<[^>]+>/g, '');
  };

  const getOrderedListItem = (text: string) => {
    return text.match(/^(\d+)\.\s+(.*)$/);
  };

  // Global Structural Parser Block
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements = [];
    let index = 0;

    while (index < lines.length) {
      const paragraph = lines[index];
      const trimmed = paragraph.trim();

      if (!trimmed) {
        index += 1;
        continue;
      }

      // Centered Math Blocks ($$ formula $$)
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        const formula = trimmed.slice(2, -2).trim();
        elements.push(
          <div key={index} className="my-6 overflow-x-auto py-2 text-center bg-slate-900/40 rounded-lg border border-slate-900 px-4">
            <MathRenderer formula={formula} displayMode={true} />
          </div>
        );
        index += 1;
        continue;
      }

      // Section Subheaders (#### Title)
      if (trimmed.startsWith('####')) {
        elements.push(
          <h4 key={index} className="text-xs font-bold text-slate-200 mt-5 mb-2 tracking-tight">
            {trimmed.replace(/^####\s*/, '').trim()}
          </h4>
        );
        index += 1;
        continue;
      }

      // Section Headers (### Title)
      if (trimmed.startsWith('###')) {
        elements.push(
          <h3 key={index} className="text-sm font-bold text-indigo-400 mt-6 mb-2 tracking-tight uppercase">
            {trimmed.replace(/^###\s*/, '').trim()}
          </h3>
        );
        index += 1;
        continue;
      }

      // Visual Split Lines (---)
      if (trimmed === '---') {
        elements.push(<hr key={index} className="border-slate-900 my-6" />);
        index += 1;
        continue;
      }

      // HTML ordered lists from article content
      if (trimmed === '<ol>') {
        const items = [];
        index += 1;

        while (index < lines.length && lines[index].trim() !== '</ol>') {
          const itemMatch = lines[index].trim().match(/^<li>(.*)<\/li>$/);

          if (itemMatch) {
            items.push(normalizeInlineHtml(itemMatch[1]));
          }

          index += 1;
        }

        elements.push(
          <ol key={`ol-${index}`} className="list-decimal pl-5 space-y-2 my-4 text-xs text-slate-300 leading-relaxed">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInlineStyles(item)}</li>
            ))}
          </ol>
        );
        index += 1;
        continue;
      }

      // Bullet Lists (* item)
      if (/^[-*]\s+/.test(trimmed)) {
        const items = [];

        while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^[-*]\s+/, '').trim());
          index += 1;
        }

        elements.push(
          <ul key={`ul-${index}`} className="list-disc pl-5 space-y-1 my-3 text-xs text-slate-300 leading-relaxed">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInlineStyles(item)}</li>
            ))}
          </ul>
        );
        continue;
      }

      // Enumerated Lists (1. item)
      if (getOrderedListItem(trimmed)) {
        const items = [];
        const startNumber = Number(getOrderedListItem(trimmed)?.[1] ?? 1);

        while (index < lines.length && getOrderedListItem(lines[index].trim())) {
          const itemMatch = getOrderedListItem(lines[index].trim());
          items.push(itemMatch?.[2].trim() ?? '');
          index += 1;
        }

        elements.push(
          <ol key={`ol-${index}`} start={startNumber} className="list-decimal pl-5 space-y-2 my-4 text-xs text-slate-300 leading-relaxed">
            {items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInlineStyles(item)}</li>
            ))}
          </ol>
        );
        continue;
      }

      // Standard Paragraph
      elements.push(
        <p key={index} className="text-xs text-slate-300 leading-relaxed mb-4 antialiased">
          {renderInlineStyles(paragraph)}
        </p>
      );
      index += 1;
    }

    return elements;
  };

  return (
    <article className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 transition-all duration-300 hover:border-slate-800/60 hover:bg-slate-900/20">
      
      {/* Metadata Indicators */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-slate-500 mb-4">
        <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold tracking-wide">
          {post.category}
        </span>
        <span>•</span>
        <span className="font-mono">{post.date}</span>
        <span>•</span>
        <span className="text-slate-400">{post.readTime}</span>
      </div>

      {/* Main Action Header */}
      <h2 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-lg font-extrabold text-white mb-3 tracking-tight hover:text-indigo-400 transition-colors cursor-pointer leading-snug"
      >
        {post.title}
      </h2>

      {/* Excerpt Summary */}
      <p className="text-xs text-slate-400 leading-relaxed mb-5 font-normal">
        {post.excerpt}
      </p>

      {/* Main Text Presentation Area */}
      {isExpanded ? (
        <div className="mt-6 pt-6 border-t border-slate-900 bg-slate-950/40 p-6 rounded-xl border border-slate-900/80">
          <div className="prose prose-invert max-w-none">
            {renderFormattedContent(post.content)}
          </div>

          <button 
            type="button"
            onClick={() => setIsExpanded(false)}
            className="block text-indigo-400 hover:text-indigo-300 text-[10px] font-bold pt-6 transition-colors tracking-widest uppercase mt-4"
          >
            ▲ Collapse Technical Ledger
          </button>
        </div>
      ) : (
        <button 
          type="button"
          onClick={() => setIsExpanded(true)}
          className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors group"
        >
          Examine Full Research Text 
          <span className="transform group-hover:translate-x-0.5 transition-transform">↗</span>
        </button>
      )}
    </article>
  );
}
