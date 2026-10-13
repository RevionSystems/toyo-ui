/**
 * Loads a component's real source text so the API tab shows the actual TypeScript
 * declarations instead of a hand-maintained copy.
 */
const SOURCES = import.meta.glob<string>('/src/components/ui/*.tsx', { query: '?raw', import: 'default' });

/** Extracts top-level `export type …;` and `export interface … { … }` declarations (with their JSDoc). */
export function extractPublicTypes(source: string): string {
  const lines = source.split('\n');
  const blocks: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!/^export (type|interface) /.test(line)) continue;
    // Include a JSDoc block immediately above.
    let start = i;
    const above = lines[i - 1]?.trim() ?? '';
    if (above.startsWith('/**') && above.endsWith('*/')) {
      start = i - 1;
    } else if (above === '*/') {
      while (start > 0 && !lines[start - 1]!.trim().startsWith('/**')) start--;
      start--;
    }
    let end = i;
    if (line.startsWith('export interface') && !line.trimEnd().endsWith('}')) {
      while (end < lines.length && lines[end] !== '}') end++;
    } else {
      while (end < lines.length && !lines[end]!.trimEnd().endsWith(';')) end++;
    }
    blocks.push(lines.slice(start, end + 1).join('\n'));
    i = end;
  }
  return blocks.join('\n\n');
}

export async function loadPublicTypes(componentName: string): Promise<string | undefined> {
  const load = SOURCES[`/src/components/ui/${componentName}.tsx`];
  if (!load) return undefined;
  return extractPublicTypes(await load());
}
