import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useId, useState, type ReactNode } from 'react';
import { MetaList, RelatedList, StatusChip } from '@/components';
import { getSystem, partsForManual, proceduresForManual } from '@/data/repository';
import type { Manual } from '@/data/types';

export interface ManualTabsProps {
  manual: Manual;
  /** Hides the manufacturing tab and trims spacing for dashboard use. */
  compact?: boolean;
}

export function ManualTabs({ manual, compact = false }: ManualTabsProps) {
  const uid = useId();
  const [tab, setTab] = useState(0);
  const parts = partsForManual(manual);
  const procs = proceduresForManual(manual);

  const panels: { label: string; content: ReactNode }[] = [
    {
      label: 'Overview',
      content: (
        <>
          <Typography variant="body2" sx={{ fontSize: 14, mb: 4, maxWidth: 640 }}>
            {manual.summary}
          </Typography>
          <MetaList
            dense={compact}
            items={[
              { label: 'Document number', value: manual.id },
              { label: 'System', value: getSystem(manual.systemId)?.name },
              { label: 'Applies to', value: manual.appliesTo },
              { label: 'Estimated read time', value: `${manual.readMinutes} minutes` },
              { label: 'Related parts', value: `${parts.length} components` },
              { label: 'Related procedures', value: `${procs.length} manufacturing processes` },
            ]}
          />
        </>
      ),
    },
    {
      label: 'Procedure',
      content: (
        <Box component="ol" sx={{ m: 0, pl: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {manual.sections.map((s) => (
            <li key={s.heading}>
              <Typography variant="h5" component="h3" sx={{ mb: 1 }}>{s.heading}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>{s.body}</Typography>
            </li>
          ))}
        </Box>
      ),
    },
    {
      label: 'Specifications',
      content: manual.torqueSpecs.length ? (
        <Table size="small" aria-label={`Torque specifications for ${manual.id}`}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Torque (N·m)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manual.torqueSpecs.map((t) => (
              <TableRow key={t.item}>
                <TableCell>{t.item}</TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{t.newtonMeters}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body2" color="text.secondary">This manual has no torque specifications.</Typography>
      ),
    },
    {
      label: 'Related Parts',
      content: (
        <RelatedList
          title="Parts"
          icon={<SettingsOutlinedIcon fontSize="small" />}
          items={parts.map((p) => ({ id: p.id, code: p.id, primary: p.name, secondary: p.assembly, trailing: <StatusChip status={p.status} />, href: `/parts/${p.id}` }))}
        />
      ),
    },
  ];
  if (!compact) {
    panels.push({
      label: 'Manufacturing',
      content: (
        <RelatedList
          title="Manufacturing processes"
          icon={<PrecisionManufacturingOutlinedIcon fontSize="small" />}
          emptyMessage="No manufacturing processes reference this manual yet."
          items={procs.map((p) => ({ id: p.id, code: p.id, primary: p.name, secondary: `${p.plant} · ${p.station}`, href: `/manufacturing?q=${p.id}` }))}
        />
      ),
    });
  }

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        variant="scrollable"
        scrollButtons={false}
        aria-label={`${manual.title} sections`}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: compact ? 4 : 6 }}
      >
        {panels.map((p, i) => (
          <Tab key={p.label} label={p.label} id={`${uid}-tab-${i}`} aria-controls={`${uid}-panel-${i}`} />
        ))}
      </Tabs>
      {panels.map((p, i) => (
        <Box key={p.label} role="tabpanel" id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-tab-${i}`} hidden={tab !== i}>
          {tab === i && p.content}
        </Box>
      ))}
    </Box>
  );
}
