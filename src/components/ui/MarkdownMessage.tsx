'use client';

import React from 'react';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Bold (**text** or __text__)
  const boldRegex = /\*\*(.+?)\*\*|__(.+?)__/g;
  // Italic (*text* or _text_)
  const italicRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g;
  // Inline code (`code`)
  const codeRegex = /`([^`]+)`/g;

  // Combined regex for all inline patterns
  const inlineRegex = /\*\*(.+?)\*\*|__(.+?)__|`([^`]+)`|\*(?!\*)(.+?)\*(?!\*)|_(?!_)(.+?)_(?!_)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined || match[2] !== undefined) {
      // Bold
      parts.push(<strong key={match.index} className="font-semibold">{match[1] ?? match[2]}</strong>);
    } else if (match[3] !== undefined) {
      // Inline code
      parts.push(
        <code key={match.index} className="bg-gray-200 text-gray-800 rounded px-1 py-0.5 text-xs font-mono">
          {match[3]}
        </code>
      );
    } else if (match[4] !== undefined || match[5] !== undefined) {
      // Italic
      parts.push(<em key={match.index} className="italic">{match[4] ?? match[5]}</em>);
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function parseTable(lines: string[]): React.ReactNode {
  // lines[0] = header row, lines[1] = separator, lines[2+] = data rows
  const parseRow = (line: string) =>
    line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map(cell => cell.trim());

  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);

  return (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((h, i) => (
              <th key={i} className="border border-gray-300 px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                {parseInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-gray-300 px-2 py-1 text-gray-700 whitespace-nowrap">
                  {parseInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MarkdownMessage({ content, className = '' }: MarkdownMessageProps) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines (add spacing)
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule: --- or *** or ___
    if (/^(\s*[-*_]){3,}\s*$/.test(line)) {
      nodes.push(<hr key={i} className="border-gray-300 my-2" />);
      i++;
      continue;
    }

    // Headings: # ## ###
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const headingClasses: Record<number, string> = {
        1: 'text-base font-bold text-gray-900 mt-2 mb-1',
        2: 'text-sm font-bold text-gray-800 mt-2 mb-1',
        3: 'text-sm font-semibold text-gray-700 mt-1 mb-0.5',
      };
      nodes.push(
        <div key={i} className={headingClasses[level] ?? headingClasses[3]}>
          {parseInline(text)}
        </div>
      );
      i++;
      continue;
    }

    // Table: detect by pipe characters in current and next line (separator)
    if (line.includes('|') && lines[i + 1]?.match(/^\|?[\s\-|:]+\|?$/)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        nodes.push(<div key={`table-${i}`}>{parseTable(tableLines)}</div>);
      }
      continue;
    }

    // Unordered list: - item or * item
    if (/^[\s]*[-*+]\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[\s]*[-*+]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[\s]*[-*+]\s+/, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-0.5 my-1 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-gray-800">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list: 1. item
    if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-0.5 my-1 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-gray-800">
              {parseInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={i} className="leading-relaxed">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return (
    <div className={`space-y-1 text-sm ${className}`}>
      {nodes}
    </div>
  );
}
