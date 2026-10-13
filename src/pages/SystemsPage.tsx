import Box from '@mui/material/Box';
import { DomainCard, PageHeader } from '@/components';
import { listSystems, manualsForSystem, partsForSystem } from '@/data/repository';

export function SystemsPage() {
  return (
    <>
      <PageHeader
        overline="Vehicle architecture"
        title="Vehicle Systems"
        description="The modular platform broken down into eight systems. Each one links its manuals, parts and manufacturing processes."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vehicle Systems' }]}
      />
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' } }}>
        {listSystems().map((s, i) => (
          <li key={s.id}>
            <DomainCard
              index={i + 1}
              overline="System"
              title={s.name}
              description={s.description}
              image={s.image}
              href={`/systems/${s.id}`}
              headingLevel="h2"
              meta={[`${manualsForSystem(s.id).length} manuals`, `${partsForSystem(s.id).length} parts`]}
            />
          </li>
        ))}
      </Box>
    </>
  );
}
