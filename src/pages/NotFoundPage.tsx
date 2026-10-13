import Button from '@mui/material/Button';
import { EmptyState, PageHeader } from '@/components';

export function NotFoundPage({ entity }: { entity?: string }) {
  return (
    <>
      <PageHeader title={entity ? `${entity} not found` : 'Page not found'} overline="404" />
      <EmptyState
        title="Nothing at this address"
        description={entity ? `The ${entity.toLowerCase()} may have been superseded or the ID is incorrect.` : 'The link may be outdated.'}
        action={<Button variant="contained" href="/">Back to home</Button>}
      />
    </>
  );
}
