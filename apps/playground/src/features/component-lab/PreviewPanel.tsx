import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { forwardRef, useCallback, useState, type ReactNode } from 'react';
import { PreviewContainerContext } from './previewContainer';
import { PreviewErrorBoundary } from './PreviewErrorBoundary';
import type { GallerySection } from './types';

const VIEWPORTS = {
  desktop: { width: '100%', label: 'Desktop width', icon: <DesktopWindowsOutlinedIcon fontSize="small" /> },
  tablet: { width: 768, label: 'Tablet width (768px)', icon: <TabletMacOutlinedIcon fontSize="small" /> },
  mobile: { width: 375, label: 'Mobile width (375px)', icon: <PhoneIphoneOutlinedIcon fontSize="small" /> },
} as const;
type Viewport = keyof typeof VIEWPORTS;

export interface PreviewPanelProps {
  /** The configured instance, driven by the properties panel. */
  playground: ReactNode;
  gallery?: GallerySection[];
  /** Serialised playground state; resets the error boundary when it changes. */
  stateKey: string;
}

/**
 * Live preview with viewport widths and an independent color scheme. The scheme is
 * applied with the theme's `data-color-scheme` attribute, which scopes CSS variables to
 * this subtree — the rest of the page keeps its own scheme.
 */
export const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(function PreviewPanel(
  { playground, gallery = [], stateKey },
  ref,
) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  // Forward the frame to the parent's ref (axe target) and keep it for overlay portals.
  const frameRef = useCallback(
    (el: HTMLDivElement | null) => {
      setFrame(el);
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  return (
    <Card
      component="section"
      aria-labelledby="preview-title"
      sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          px: 4,
          py: 3,
          borderBottom: 1,
          borderColor: 'divider',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 160 }}>
          <Typography id="preview-title" variant="h2" sx={{ fontSize: 16 }}>
            Preview
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Change properties to update the playground. The gallery shows fixed variants and states.
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={scheme}
          onChange={(_, v) => v && setScheme(v)}
          aria-label="Preview color scheme"
        >
          <ToggleButton value="light" sx={{ px: 2 }}>
            Light
          </ToggleButton>
          <ToggleButton value="dark" sx={{ px: 2 }}>
            Dark
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={viewport}
          onChange={(_, v) => v && setViewport(v)}
          aria-label="Preview width"
        >
          {(Object.keys(VIEWPORTS) as Viewport[]).map((v) => (
            <ToggleButton key={v} value={v} aria-label={VIEWPORTS[v].label}>
              {VIEWPORTS[v].icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ flex: 1, bgcolor: 'surfaceMuted', p: { xs: 2, md: 4 }, overflowX: 'auto' }}>
        <Box
          ref={frameRef}
          data-color-scheme={scheme}
          data-testid="lab-preview"
          sx={{
            width: VIEWPORTS[viewport].width,
            maxWidth: '100%',
            mx: 'auto',
            bgcolor: 'background.paper',
            color: 'text.primary',
            colorScheme: scheme,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            transition: 'width 200ms',
          }}
        >
          <Box
            component="section"
            aria-labelledby="playground-title"
            sx={{ p: { xs: 3, md: 5 }, borderBottom: gallery.length ? 1 : 0, borderColor: 'divider' }}
          >
            <Typography
              id="playground-title"
              variant="overline"
              component="h3"
              sx={{ display: 'block', color: 'text.secondary', mb: 3 }}
            >
              Playground
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 96 }}>
              <PreviewErrorBoundary resetKey={stateKey}>
                <PreviewContainerContext value={frame}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{playground}</Box>
                </PreviewContainerContext>
              </PreviewErrorBoundary>
            </Box>
          </Box>
          {gallery.map((section) => (
            <Box
              key={section.title}
              component="section"
              aria-label={section.title}
              sx={{ px: { xs: 3, md: 5 }, py: 3.5, '& + &': { borderTop: 1, borderColor: 'divider' } }}
            >
              <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
                {section.title}
              </Typography>
              {section.render()}
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
});
