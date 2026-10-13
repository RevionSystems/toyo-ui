import Box from '@mui/material/Box';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotFoundPage } from '@/app/NotFoundPage';
import { EmptyState } from '@/components/ui';
import { isComponentId, type ComponentId } from '@shared/catalog';
import { DetailTabs } from './DetailTabs';
import { LabBanner } from './LabBanner';
import { PreviewPanel } from './PreviewPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { getEntry } from './registry';
import type { AnyLabEntry } from './types';

export default function ComponentLabPage() {
  const { componentId = '' } = useParams();
  if (!isComponentId(componentId)) return <NotFoundPage entity="Component" />;
  // Keyed by id so playground state resets when switching components.
  return <Workspace key={componentId} id={componentId} entry={getEntry(componentId)} />;
}

function Workspace({ id, entry }: { id: ComponentId; entry?: AnyLabEntry }) {
  // One state object drives the preview, the properties panel and the generated code.
  const [state, setState] = useState<Record<string, unknown>>(entry?.defaults ?? {});
  const previewRef = useRef<HTMLDivElement>(null);
  const stateKey = JSON.stringify(state);

  return (
    <>
      <LabBanner id={id} />
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' }, mb: 4 }}>
        <PreviewPanel
          ref={previewRef}
          stateKey={stateKey}
          playground={
            entry ? (
              entry.render(state)
            ) : (
              <EmptyState
                title="Interactive preview coming soon"
                description="Documentation for this component is available below."
              />
            )
          }
          gallery={entry?.gallery}
        />
        {entry && (
          <PropertiesPanel
            controls={entry.controls}
            state={state}
            onChange={(name, value) => setState((s) => ({ ...s, [name]: value }))}
            onReset={() => setState(entry.defaults)}
          />
        )}
      </Box>
      <DetailTabs id={id} code={entry?.code(state)} previewRef={previewRef} />
    </>
  );
}
