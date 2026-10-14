import { CATALOG, CATEGORIES, componentsInCategory } from '@/catalog/catalog';

export interface NavItem {
  label: string;
  href: string;
  /** Short muted marker after the label, e.g. "Beta". */
  badge?: string;
}

export interface NavGroup {
  /** Section heading; omitted for the top-level group. */
  label?: string;
  items: NavItem[];
}

/** Components in category order; beta components are marked so status is visible in navigation. */
const componentItems = (): NavItem[] =>
  CATEGORIES.flatMap((c) =>
    componentsInCategory(c.id).map((id) => ({
      label: CATALOG[id].name,
      href: `/components/${id}`,
      badge: CATALOG[id].status === 'beta' ? 'Beta' : undefined,
    })),
  );

export const NAV: NavGroup[] = [
  { items: [{ label: 'Overview', href: '/' }] },
  { label: 'Components', items: componentItems() },
  {
    label: 'Foundations',
    items: [
      { label: 'Colors & Tokens', href: '/foundations/tokens' },
      { label: 'Typography', href: '/foundations/typography' },
      { label: 'Spacing', href: '/foundations/spacing' },
      { label: 'Theme', href: '/foundations/theme' },
      { label: 'Accessibility', href: '/foundations/accessibility' },
    ],
  },
  {
    label: 'Engineering',
    items: [
      { label: 'API Explorer', href: '/engineering/api' },
      { label: 'Test Explorer', href: '/engineering/tests' },
      { label: 'Documentation', href: '/engineering/docs' },
    ],
  },
];

/** Flat list of every destination, used by the command search. */
export const ALL_DESTINATIONS = NAV.flatMap((g) =>
  g.items.map((i) => ({ label: i.label, href: i.href, group: g.label ?? 'Library' })),
);
