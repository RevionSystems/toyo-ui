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
import { CATALOG, componentsInCategory, type CategoryId } from '@shared/catalog';

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

const CATEGORY_LABELS: Record<CategoryId, string> = {
  buttons: 'Buttons',
  inputs: 'Inputs',
  feedback: 'Feedback',
  overlays: 'Overlays',
  'data-display': 'Data Display',
};

/** A category links to its first component and is active for any component in it. */
const categoryItem = (category: CategoryId): NavItem => {
  const ids = componentsInCategory(category);
  return {
    label: CATEGORY_LABELS[category],
    href: `/components/${ids[0]}`,
    icon: CATEGORY_ICONS[category],
    isActive: (pathname) => ids.some((id) => pathname === `/components/${id}`),
  };
};

export const NAV: NavGroup[] = [
  {
    label: 'Component library',
    items: [
      { label: 'Overview', href: '/', icon: <DashboardOutlinedIcon /> },
      ...(Object.keys(CATEGORY_LABELS) as CategoryId[]).map(categoryItem),
    ],
  },
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
export const ALL_DESTINATIONS = [
  ...NAV.flatMap((g) => g.items.map((i) => ({ label: i.label, href: i.href, group: g.label }))),
  ...Object.values(CATALOG).map((c) => ({ label: c.name, href: `/components/${c.id}`, group: 'Components' })),
];
