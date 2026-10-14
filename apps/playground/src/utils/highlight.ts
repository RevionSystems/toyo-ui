export type TokenKind = 'keyword' | 'string' | 'comment' | 'tag' | 'attr' | 'number' | 'text';

export interface Token {
  kind: TokenKind;
  value: string;
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'default',
  'function',
  'return',
  'const',
  'let',
  'var',
  'interface',
  'type',
  'extends',
  'implements',
  'true',
  'false',
  'null',
  'undefined',
  'async',
  'await',
  'new',
  'if',
  'else',
  'describe',
  'it',
  'test',
  'expect',
]);

// Order matters: comments and strings must win over everything inside them.
const PATTERN =
  /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(?<string>'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(?<tag><\/?[A-Z][\w.]*|<\/?[a-z][\w-]*(?=[\s>/])|\/?>)|(?<attr>\b[a-zA-Z][\w-]*(?==))|(?<number>\b\d+(?:\.\d+)?\b)|(?<word>\b[A-Za-z_$][\w$]*\b)/g;

/**
 * Minimal tokenizer for TS/JSX code samples. Returns plain tokens that the UI renders
 * as text spans — never HTML — so model-generated code cannot inject markup.
 */
export function highlight(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(PATTERN)) {
    const start = m.index ?? 0;
    if (start > last) tokens.push({ kind: 'text', value: code.slice(last, start) });
    const g = m.groups ?? {};
    const value = m[0];
    const kind: TokenKind = g.comment
      ? 'comment'
      : g.string
        ? 'string'
        : g.tag
          ? 'tag'
          : g.attr
            ? 'attr'
            : g.number
              ? 'number'
              : KEYWORDS.has(value)
                ? 'keyword'
                : 'text';
    tokens.push({ kind, value });
    last = start + value.length;
  }
  if (last < code.length) tokens.push({ kind: 'text', value: code.slice(last) });
  return tokens;
}
