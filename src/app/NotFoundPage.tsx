import Button from '@mui/material/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotFoundPage({ entity }: { entity?: string }) {
  return (
    <>
      <PageHeader title={entity ? `${entity} not found` : 'Page not found'} overline="404" />
      <EmptyState
        title="Nothing at this address"
        description="The link may be outdated."
        action={
          <Button variant="contained" href="/">
            Back to overview
          </Button>
        }
      />
    </>
  );
}
