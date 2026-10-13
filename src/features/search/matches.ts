/** Case-insensitive "every term appears somewhere" match for list-page filtering. */
export function matchesQuery(query: string | null, ...fields: (string | undefined)[]): boolean {
  if (!query?.trim()) return true;
  const haystack = fields.filter(Boolean).join(' ').toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => haystack.includes(t));
}
