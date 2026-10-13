type PropValue = string | number | boolean | undefined | null | { raw: string };

/** Marks a value to be emitted verbatim inside braces, e.g. `raw('[…]')`. */
export const raw = (code: string) => ({ raw: code });

/**
 * Serializes a JSX element for code examples. Omits `undefined`, `false` and values
 * equal to the documented default so snippets show only what the user changed.
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
  if (options.children === undefined) return `${open}${open.endsWith('\n') ? '' : ' '}/>`;
  return `${open}>\n  ${options.children}\n</${name}>`;
}
