import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SearchIcon from '@mui/icons-material/Search';
import type { ReactNode } from 'react';

/**
 * Icons selectable in the playground. Each name maps to the element rendered in the
 * preview and to the import line printed in the code example, so the two cannot drift.
 */
export const ICONS = {
  None: null,
  Add: { node: <AddIcon />, component: 'AddIcon', module: '@mui/icons-material/Add' },
  ArrowForward: {
    node: <ArrowForwardIcon />,
    component: 'ArrowForwardIcon',
    module: '@mui/icons-material/ArrowForward',
  },
  Delete: {
    node: <DeleteOutlineIcon />,
    component: 'DeleteOutlineIcon',
    module: '@mui/icons-material/DeleteOutlineOutlined',
  },
  Download: { node: <DownloadIcon />, component: 'DownloadIcon', module: '@mui/icons-material/Download' },
  Save: { node: <SaveOutlinedIcon />, component: 'SaveOutlinedIcon', module: '@mui/icons-material/SaveOutlined' },
  Search: { node: <SearchIcon />, component: 'SearchIcon', module: '@mui/icons-material/Search' },
} as const satisfies Record<string, { node: ReactNode; component: string; module: string } | null>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export const iconNode = (name: IconName) => ICONS[name]?.node;
export const iconImport = (name: IconName) => {
  const icon = ICONS[name];
  return icon ? `import ${icon.component} from '${icon.module}';` : undefined;
};
export const iconJsx = (name: IconName) => {
  const icon = ICONS[name];
  return icon ? `<${icon.component} />` : undefined;
};
