import { useMemo } from 'react';

/**
 * Small, dependency-free renderer for the exact Markdown subset used by seeded
 * content: headings, paragraphs, bold, inline code, fenced code, bullet and
 * numbered lists, and pipe tables.
 *
 * Content is escaped before any formatting is applied, so nothing in the source
 * can inject markup — the output never contains user-authored HTML.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Inline formatting, applied to already-escaped text. */
function inline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
}

function renderTable(rows: string[]): string {
  const cells = (row: string) =>
    row
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());

  const header = cells(rows[0] ?? '');
  // rows[1] is the |---|---| separator, which carries no content.
  const body = rows.slice(2).map(cells);

  const head = `<thead><tr>${header.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${body
    .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;

  return `<table>${head}${tbody}</table>`;
}

function toHtml(markdown: string): string {
  const lines = escapeHtml(markdown).split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? '').trimStart().startsWith('```')) {
        code.push(lines[i] ?? '');
        i += 1;
      }
      i += 1; // closing fence
      out.push(`<pre><code>${code.join('\n')}</code></pre>`);
      continue;
    }

    // Table — needs at least a header and a separator row
    if (line.trim().startsWith('|') && (lines[i + 1] ?? '').includes('---')) {
      const rows: string[] = [];
      while (i < lines.length && (lines[i] ?? '').trim().startsWith('|')) {
        rows.push((lines[i] ?? '').trim());
        i += 1;
      }
      out.push(renderTable(rows));
      continue;
    }

    // Heading
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(heading[1]!.length + 1, 4); // h1 in content renders as h2
      out.push(`<h${level}>${inline(heading[2] ?? '')}</h${level}>`);
      i += 1;
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^\s*[-*]\s+/, ''));
        i += 1;
      }
      out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^\s*\d+\.\s+/, ''));
        i += 1;
      }
      out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>`);
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Paragraph — collect until a blank line or a block starter
    const para: string[] = [];
    while (
      i < lines.length &&
      (lines[i] ?? '').trim() &&
      !/^\s*[-*]\s+/.test(lines[i] ?? '') &&
      !/^\s*\d+\.\s+/.test(lines[i] ?? '') &&
      !/^#{1,4}\s/.test(lines[i] ?? '') &&
      !(lines[i] ?? '').trimStart().startsWith('```') &&
      !(lines[i] ?? '').trim().startsWith('|')
    ) {
      para.push(lines[i] ?? '');
      i += 1;
    }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return out.join('');
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const html = useMemo(() => toHtml(content), [content]);
  return (
    <div
      className={`prose-devprep ${className ?? ''}`}
      // Safe: toHtml escapes the source before generating any tags.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Read-only syntax-free code block used for examples and outputs. */
export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface-sunken">
      {label && (
        <div className="border-b border-line px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-content-subtle">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto p-3">
        <code className="font-mono text-[13px] leading-6 text-content">{code}</code>
      </pre>
    </div>
  );
}
