import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { DomainCard, Eyebrow, StatusChip } from '@/components';
import { getManual, listSystems, platformStats } from '@/data/repository';
import { AssistantPanel } from '@/features/assistant/AssistantPanel';
import { ExplodedView } from '@/features/home/ExplodedView';
import { ManualTabs } from '@/features/manuals/ManualTabs';

const FEATURED_MANUAL = 'BR-0012';

export function HomePage() {
  const stats = platformStats();
  const manual = getManual(FEATURED_MANUAL)!;

  const domains = [
    { overline: 'Vehicle Systems', title: 'Vehicle Systems', description: 'Explore complete vehicle architecture and assemblies.', image: '/img/exploded-chassis.jpg', href: '/systems', meta: [`${stats.systems} systems`, `${stats.assemblies} assemblies`] },
    { overline: 'Engineering Manuals', title: 'Technical Documentation', description: 'Service manuals, assembly guides, inspection procedures and more.', image: '/img/manual.jpg', href: '/manuals', meta: [`${stats.manuals} manuals`, 'Revision controlled'] },
    { overline: 'Parts & Assemblies', title: 'Parts & Assemblies', description: 'Component information, part numbers and specifications.', image: '/img/brake-caliper.jpg', href: '/parts', meta: [`${stats.parts} parts`, `${stats.assemblies} assemblies`] },
    { overline: 'Supply Chain', title: 'Suppliers & Sourcing', description: 'Supplier information, lead times and approved alternatives.', image: '/img/warehouse.jpg', href: '/suppliers', meta: [`${stats.suppliers} suppliers`, '3 regions'] },
    { overline: 'Manufacturing', title: 'Manufacturing Processes', description: 'Assembly sequences, stations and cycle times by plant.', image: '/img/assembly-line.jpg', href: '/manufacturing', meta: [`${stats.procedures} procedures`, `${stats.plants} plants`] },
    { overline: 'Design System', title: 'Component Lab', description: 'The shared React components behind this hub, with live props.', image: '/img/technician.jpg', href: '/lab', meta: ['13 components', 'Typed APIs'] },
  ];

  return (
    <>
      {/* Hero */}
      <Box
        component="section"
        aria-labelledby="hero-title"
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(380px, 5fr) 7fr' },
          borderRadius: 2,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          mb: 6,
        }}
      >
        <Box sx={{ p: { xs: 6, md: 10 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
          <Eyebrow accent>Engineering knowledge platform</Eyebrow>
          <Typography id="hero-title" variant="display" component="h1" sx={{ mt: 4, mb: 4 }}>
            Engineering the systems behind every journey.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 460, mb: 6 }}>
            Explore vehicle architecture, technical documentation, manufacturing processes and component
            relationships in one engineering workspace.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" href="/manuals" endIcon={<ArrowForwardIcon />}>
              Explore engineering manuals
            </Button>
            <Button variant="outlined" size="large" href="/parts">
              Browse parts
            </Button>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', minHeight: { xs: 260, md: 380 } }}>
          <Box
            component="img"
            src="/img/hero-vehicle.jpg"
            alt="Silver compact crossover driving on a coastal mountain road"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              display: { xs: 'none', lg: 'block' },
              background: (t) => `linear-gradient(90deg, ${t.vars?.palette.background.paper ?? '#fff'} 0%, transparent 22%)`,
            }}
          />
          <Card
            component="nav"
            aria-label="Vehicle architecture"
            sx={{
              position: 'absolute',
              right: 24,
              top: 24,
              width: 240,
              p: 4,
              display: { xs: 'none', xl: 'flex' },
              flexDirection: 'column',
              bgcolor: 'color-mix(in srgb, var(--toyo-palette-background-paper) 88%, transparent)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography variant="h4" component="h2" sx={{ fontFamily: 'serif' }}>Vehicle Architecture</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 3 }}>
              Modular platform design for electrified mobility.
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto' }}>
              {listSystems().map((s) => (
                <li key={s.id}>
                  <Link href={`/systems/${s.id}`} color="text.primary" sx={{ fontSize: 13, display: 'block', py: 0.75 }}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Domains */}
      <Box component="section" aria-label="Knowledge domains" sx={{ mb: 6 }}>
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            '@media (min-width: 1800px)': { gridTemplateColumns: 'repeat(6, 1fr)' },
          }}
        >
          {domains.map((d, i) => (
            <li key={d.href}>
              <DomainCard index={i + 1} {...d} />
            </li>
          ))}
        </Box>
      </Box>

      {/* Workspace row */}
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)', xl: '4fr 5fr 4fr' } }}>
        <Card component="section" aria-labelledby="featured-manual-title" sx={{ p: 6 }}>
          <Eyebrow>Engineering manuals</Eyebrow>
          <Typography id="featured-manual-title" variant="h2" sx={{ mt: 2, mb: 3 }}>
            <Link href={`/manuals/${manual.id}`} color="inherit">{manual.title}</Link>
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', mb: 4 }}>
            <StatusChip status={manual.status} />
            <Typography variant="body2" color="text.secondary">Rev {manual.revision}</Typography>
            <Typography variant="body2" color="text.secondary">{manual.updated}</Typography>
            <Chip size="small" variant="outlined" icon={<FileDownloadOutlinedIcon />} label="PDF" aria-label="PDF available" sx={{ ml: 'auto' }} />
          </Box>
          <ManualTabs manual={manual} compact />
        </Card>

        <Card component="section" aria-labelledby="exploded-title" sx={{ p: 6 }}>
          <Typography id="exploded-title" variant="h4" component="h2" sx={{ mb: 2 }}>
            Front brake corner
          </Typography>
          <ExplodedView
            image="/img/brake-caliper.jpg"
            imageAlt="Front brake corner: ventilated disc rotor, red four-piston caliper and hub"
            hotspots={[
              { partId: 'PT-3310-12A', x: 82, y: 38 },
              { partId: 'PT-3310-12C', x: 30, y: 28 },
              { partId: 'PT-3310-12D', x: 28, y: 54 },
              { partId: 'PT-3310-12B', x: 92, y: 74 },
            ]}
            partIds={manual.partIds}
          />
        </Card>

        <Card component="section" aria-labelledby="assistant-title" sx={{ p: 6, gridColumn: { lg: '1 / -1', xl: 'auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography id="assistant-title" variant="overline" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ color: 'primary.main' }}>AI</Box> Engineering assistant
            </Typography>
            <Chip size="small" label="Demo" variant="outlined" />
          </Box>
          <AssistantPanel variant="compact" />
        </Card>
      </Box>
    </>
  );
}
