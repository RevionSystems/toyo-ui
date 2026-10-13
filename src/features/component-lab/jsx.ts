type PropValue = string | number | boolean | undefined | null | { raw: string };

/** Marks a value to be emitted verbatim inside braces, e.g. `raw('<DownloadIcon />')`. */
export const raw = (code: string) => ({ raw: code });

/**
 * Serializes a JSX element for code examples. Omits `undefined`, `false` and values
 * equal to the documented default so examples show only what differs.
 */
export function jsx(
  name: string,
  props: Record<string, PropValue>,
  options: { defaults?: Record<string, PropValue>; children?: string } = {},
): string {
  const attrs = Object.entries(props).flatMap(([key, value]) => {
    if (value === undefined || value === null || value === false) return [];
    if (options.defaults && options.defaults[key] === value) return [];
    if (value === true) return [key];
    if (typeof value === 'string') return [`${key}=${JSON.stringify(value)}`];
    if (typeof value === 'number') return [`${key}={${value}}`];
    return [`${key}={${value.raw}}`];
  });
  const oneLine = `<${name}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  const open = oneLine.length > 72 ? `<${name}\n${attrs.map((a) => `  ${a}`).join('\n')}\n` : oneLine;
  if (options.children === undefined || options.children === '') return `${open}${open.endsWith('\n') ? '' : ' '}/>`;
  const children = options.children
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n');
  return `${open}>\n${children}\n</${name}>`;
}

export interface ExampleOptions {
  /** Named imports from the component library. */
  components: string[];
  /** Extra import lines, e.g. icons. */
  imports?: string[];
  /** Statements before `return`, e.g. hooks. */
  setup?: string[];
  element: string;
}

const LIBRARY_PATH = '@/components/ui';

/** Wraps an element in a complete, copy-pasteable example component. */
export function example({ components, imports = [], setup = [], element }: ExampleOptions): string {
  const head = [`import { ${[...new Set(components)].sort().join(', ')} } from '${LIBRARY_PATH}';`, ...imports].join(
    '\n',
  );
  const indent = (s: string, n: number) =>
    s
      .split('\n')
      .map((l) => (l ? ' '.repeat(n) + l : l))
      .join('\n');
  const body = [...setup.map((l) => indent(l, 2)), `  return (\n${indent(element, 4)}\n  );`].join('\n');
  return `${head}\n\nexport function Example() {\n${body}\n}\n`;
}
