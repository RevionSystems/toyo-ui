import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  /** Match nested routes, e.g. /manuals/BR-0012 highlights "Engineering Manuals". */
  matchPrefix?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  { items: [{ label: 'Home', href: '/', icon: <HomeOutlinedIcon /> }] },
  {
    label: 'Engineering',
    items: [
      { label: 'Vehicle Systems', href: '/systems', icon: <DirectionsCarOutlinedIcon />, matchPrefix: true },
      { label: 'Engineering Manuals', href: '/manuals', icon: <MenuBookOutlinedIcon />, matchPrefix: true },
      { label: 'Parts & Assemblies', href: '/parts', icon: <CategoryOutlinedIcon />, matchPrefix: true },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Supply Chain & Suppliers', href: '/suppliers', icon: <LocalShippingOutlinedIcon />, matchPrefix: true },
      { label: 'Manufacturing Processes', href: '/manufacturing', icon: <PrecisionManufacturingOutlinedIcon />, matchPrefix: true },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Component Lab', href: '/lab', icon: <ScienceOutlinedIcon />, matchPrefix: true },
      { label: 'Design Tokens', href: '/tokens', icon: <PaletteOutlinedIcon /> },
      { label: 'Accessibility & Testing', href: '/accessibility', icon: <AccessibilityNewOutlinedIcon /> },
      { label: 'AI Engineering Assistant', href: '/assistant', icon: <AutoAwesomeOutlinedIcon /> },
    ],
  },
];
