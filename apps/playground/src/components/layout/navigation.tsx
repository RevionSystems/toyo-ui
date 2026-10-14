import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import FilterNoneOutlinedIcon from '@mui/icons-material/FilterNoneOutlined';
import FormatSizeOutlinedIcon from '@mui/icons-material/FormatSizeOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import SmartButtonOutlinedIcon from '@mui/icons-material/SmartButtonOutlined';
import SpaceBarOutlinedIcon from '@mui/icons-material/SpaceBarOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import type { ReactNode } from 'react';
import { CATALOG, CATEGORIES, componentsInCategory, type CategoryId } from '@/catalog/catalog';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  /** Decides the active state; defaults to an exact path match. */
  isActive?: (pathname: string) => boolean;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const CATEGORY_ICONS: Record<CategoryId, ReactNode> = {
  buttons: <SmartButtonOutlinedIcon />,
  inputs: <InputOutlinedIcon />,
  feedback: <ChatBubbleOutlineOutlinedIcon />,
  overlays: <FilterNoneOutlinedIcon />,
  'data-display': <TableChartOutlinedIcon />,
};

/** Components in category order; beta components carry a badge so status is visible in navigation. */
const componentItems = (): NavItem[] =>
  CATEGORIES.flatMap((c) =>
    componentsInCategory(c.id).map((id) => ({
      label: CATALOG[id].name,
      href: `/components/${id}`,
      icon: CATEGORY_ICONS[c.id],
      badge: CATALOG[id].status === 'beta' ? 'Beta' : undefined,
    })),
  );

export const NAV: NavGroup[] = [
  {
    label: 'Library',
    items: [{ label: 'Overview', href: '/', icon: <DashboardOutlinedIcon /> }],
  },
  { label: 'Components', items: componentItems() },
  {
    label: 'Foundations',
    items: [
      { label: 'Colors & Tokens', href: '/foundations/tokens', icon: <PaletteOutlinedIcon /> },
      { label: 'Typography', href: '/foundations/typography', icon: <FormatSizeOutlinedIcon /> },
      { label: 'Spacing', href: '/foundations/spacing', icon: <SpaceBarOutlinedIcon /> },
      { label: 'Theme', href: '/foundations/theme', icon: <TuneOutlinedIcon /> },
      { label: 'Accessibility', href: '/foundations/accessibility', icon: <AccessibilityNewOutlinedIcon /> },
    ],
  },
  {
    label: 'Engineering',
    items: [
      { label: 'API Explorer', href: '/engineering/api', icon: <ApiOutlinedIcon /> },
      { label: 'Test Explorer', href: '/engineering/tests', icon: <FactCheckOutlinedIcon /> },
      { label: 'Documentation', href: '/engineering/docs', icon: <DescriptionOutlinedIcon /> },
    ],
  },
];

/** Flat list of every destination, used by the command search. */
export const ALL_DESTINATIONS = NAV.flatMap((g) =>
  g.items.map((i) => ({ label: i.label, href: i.href, group: g.label })),
);
