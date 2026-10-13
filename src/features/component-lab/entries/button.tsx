import Box from '@mui/material/Box';
import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui';
import { ICON_NAMES, iconImport, iconJsx, iconNode, type IconName } from '../icons';
import { example, jsx, raw } from '../jsx';
import { defineEntry } from '../types';

interface ButtonState {
  variant: ButtonVariant;
  size: ButtonSize;
  startIcon: IconName;
  endIcon: IconName;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  label: string;
}

const row = { display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' } as const;

export const buttonEntry = defineEntry<ButtonState>({
  id: 'button',
  defaults: {
    variant: 'primary',
    size: 'medium',
    startIcon: 'Add',
    endIcon: 'None',
    disabled: false,
    loading: false,
    fullWidth: false,
    label: 'Create Component',
  },
  controls: [
    { kind: 'select', name: 'variant', options: ['primary', 'secondary', 'outline', 'text'] },
    { kind: 'select', name: 'size', options: ['small', 'medium', 'large'] },
    { kind: 'select', name: 'startIcon', label: 'start icon', options: ICON_NAMES },
    { kind: 'select', name: 'endIcon', label: 'end icon', options: ICON_NAMES },
    { kind: 'boolean', name: 'disabled' },
    { kind: 'boolean', name: 'loading' },
    { kind: 'boolean', name: 'fullWidth', label: 'full width' },
    { kind: 'text', name: 'label', label: 'button text' },
  ],
  render: (s) => (
    <Button
      variant={s.variant}
      size={s.size}
      startIcon={iconNode(s.startIcon)}
      endIcon={iconNode(s.endIcon)}
      disabled={s.disabled}
      loading={s.loading}
      fullWidth={s.fullWidth}
      onClick={() => console.info('Button clicked')}
    >
      {s.label}
    </Button>
  ),
  code: (s) =>
    example({
      components: ['Button'],
      imports: [iconImport(s.startIcon), iconImport(s.endIcon)].filter((l): l is string => !!l),
      element: jsx(
        'Button',
        {
          variant: s.variant,
          size: s.size,
          startIcon: iconJsx(s.startIcon) ? raw(iconJsx(s.startIcon)!) : undefined,
          endIcon: iconJsx(s.endIcon) ? raw(iconJsx(s.endIcon)!) : undefined,
          disabled: s.disabled,
          loading: s.loading,
          fullWidth: s.fullWidth,
          onClick: raw("() => console.log('clicked')"),
        },
        { defaults: { variant: 'primary', size: 'medium' }, children: s.label },
      ),
    }),
  gallery: [
    {
      title: 'Variants',
      render: () => (
        <Box sx={row}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="text">Text</Button>
        </Box>
      ),
    },
    {
      title: 'Sizes',
      render: () => (
        <Box sx={row}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </Box>
      ),
    },
    {
      title: 'States',
      render: () => (
        <Box sx={row}>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving</Button>
          <Button variant="outline" loading startIcon={iconNode('Save')}>
            Saving
          </Button>
        </Box>
      ),
    },
    {
      title: 'With icons',
      render: () => (
        <Box sx={row}>
          <Button startIcon={iconNode('Download')}>Download</Button>
          <Button variant="outline" startIcon={iconNode('Search')}>
            Search
          </Button>
          <Button variant="text" endIcon={iconNode('ArrowForward')}>
            Next
          </Button>
        </Box>
      ),
    },
    {
      title: 'Long content',
      render: () => (
        <Box sx={{ maxWidth: 280 }}>
          <Button variant="outline">Export all component documentation as a PDF bundle</Button>
        </Box>
      ),
    },
  ],
});
