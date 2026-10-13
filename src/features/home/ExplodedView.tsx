import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { DataTable, StatusChip } from '@/components';
import { getPart } from '@/data/repository';
import type { Part } from '@/data/types';

export interface Hotspot {
  partId: string;
  /** Position over the image, in percent. */
  x: number;
  y: number;
}

export interface ExplodedViewProps {
  image: string;
  imageAlt: string;
  hotspots: Hotspot[];
  /** Parts shown in the "Parts list" tab; defaults to the hotspot parts. */
  partIds?: string[];
}

/** Assembly illustration with numbered, keyboard-accessible callouts and a parts-list tab. */
export function ExplodedView({ image, imageAlt, hotspots, partIds }: ExplodedViewProps) {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState(hotspots[0]?.partId);
  const parts = (partIds ?? hotspots.map((h) => h.partId)).map(getPart).filter((p): p is Part => !!p);
  const active = selected ? getPart(selected) : undefined;

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} aria-label="Assembly view" sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tab label="Exploded view" id="ev-tab-0" aria-controls="ev-panel-0" />
        <Tab label="Parts list" id="ev-tab-1" aria-controls="ev-panel-1" />
      </Tabs>

      <Box role="tabpanel" id="ev-panel-0" aria-labelledby="ev-tab-0" hidden={tab !== 0}>
        {tab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 2fr' }, gap: 4, alignItems: 'center' }}>
            {/* Fixed light backdrop matches the studio photograph in both color schemes. */}
            <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden', bgcolor: '#EEF0F2' }}>
              <Box component="img" src={image} alt={imageAlt} sx={{ width: '100%', display: 'block' }} />
              {hotspots.map((h, i) => {
                const isActive = h.partId === selected;
                const part = getPart(h.partId);
                return (
                  <Box
                    key={h.partId}
                    component="button"
                    type="button"
                    onClick={() => setSelected(h.partId)}
                    aria-pressed={isActive}
                    aria-label={`Callout ${i + 1}: ${part?.name ?? h.partId}`}
                    sx={{
                      position: 'absolute',
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '2px solid #fff',
                      cursor: 'pointer',
                      font: 'inherit',
                      fontSize: 12,
                      fontWeight: 700,
                      // Inactive callouts sit on a photo, so they use a fixed dark chip with white text.
                      color: isActive ? 'primary.contrastText' : '#fff',
                      bgcolor: isActive ? 'primary.main' : 'rgba(17,19,21,0.8)',
                      boxShadow: isActive ? '0 0 0 4px color-mix(in srgb, var(--toyo-palette-primary-main) 30%, transparent)' : 'none',
                      transition: 'background-color 150ms',
                      '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                    }}
                  >
                    {i + 1}
                  </Box>
                );
              })}
            </Box>
            <Box aria-live="polite">
              {active && (
                <>
                  <Typography sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}>{active.id}</Typography>
                  <Typography variant="h3" component="p" sx={{ mt: 0.5, mb: 2 }}>
                    {active.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {active.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                    <StatusChip status={active.status} />
                    <Typography variant="body2" color="text.secondary">Rev {active.revision} · {active.weightKg} kg</Typography>
                  </Box>
                  <Button size="small" variant="outlined" href={`/parts/${active.id}`}>
                    Open part
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box role="tabpanel" id="ev-panel-1" aria-labelledby="ev-tab-1" hidden={tab !== 1}>
        {tab === 1 && (
          <DataTable
            caption="Assembly parts list"
            rows={parts}
            getRowId={(p) => p.id}
            getRowHref={(p) => `/parts/${p.id}`}
            columns={[
              { key: 'id', header: 'Part no.', render: (p) => <Link href={`/parts/${p.id}`} sx={{ fontFamily: 'monospace' }}>{p.id}</Link> },
              { key: 'name', header: 'Name', render: (p) => p.name },
              { key: 'status', header: 'Status', render: (p) => <StatusChip status={p.status} />, hideOnMobile: true },
            ]}
          />
        )}
      </Box>
    </Box>
  );
}
