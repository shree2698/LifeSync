"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

export function MarkdownRenderer({ content }: { content: string }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = React.useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Process code blocks and formatted sections
  const renderFormattedContent = () => {
    if (!content) return null;

    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const language = lines[0].trim().match(/^[a-zA-Z0-9_-]+$/) ? lines[0].trim() : "";
        const codeText = language ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-border/40 bg-zinc-900 text-zinc-100 dark:border-border/20 shadow-md">
            <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-950/80 border-b border-zinc-800 text-xs font-mono text-zinc-400 select-none">
              <span>{language || "code"}</span>
              <button
                onClick={() => handleCopyCode(codeText, index)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeIndex === index ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="font-sans">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-zinc-200">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Regular text parsing: Markdown Headings, bold, bullets, linebreaks
      const textLines = part.split("\n");
      return (
        <div key={index} className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
          {textLines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-1" />;

            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={lIdx} className="font-bold text-sm sm:text-base text-foreground mt-3 mb-1">
                  {trimmed.replace(/^###\s+/, "")}
                </h3>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={lIdx} className="font-bold text-base sm:text-lg text-foreground mt-3 mb-1">
                  {trimmed.replace(/^##\s+/, "")}
                </h2>
              );
            }
            if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
              const itemText = trimmed.replace(/^[•-]\s+/, "");
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2 my-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span>{parseInlineBold(itemText)}</span>
                </div>
              );
            }

            return <p key={lIdx} className="my-1">{parseInlineBold(line)}</p>;
          })}
        </div>
      );
    });
  };

  return <div className="space-y-1">{renderFormattedContent()}</div>;
}

function parseInlineBold(text: string) {
  const parts = text.split(/(\*\*[\s\S]*?\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return p;
  });
}
