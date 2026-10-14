import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui';
import { CATALOG, CATEGORIES, componentsInCategory } from '@shared/catalog';

const REPO_DOCS = [
  { file: 'README.md', about: 'Setup, commands, workspace structure, adding and consuming components.' },
  { file: 'docs/architecture.md', about: 'Package boundaries, dependency direction, public exports, build strategy.' },
  { file: 'docs/component-guidelines.md', about: 'API conventions and the checklist for adding a component.' },
  { file: 'docs/accessibility.md', about: 'What is built in, how it is verified, known gaps.' },
  { file: 'docs/testing-strategy.md', about: 'Test layers, conventions and what is deliberately not tested.' },
  { file: 'docs/demo-script.md', about: 'A 15-minute interview walkthrough.' },
  {
    file: 'docs/adr/0001-mui-foundation-focused-api.md',
    about: 'Why MUI is the foundation and why the API is narrower.',
  },
];

export default function DocumentationPage() {
  return (
    <>
      <PageHeader
        overline="Engineering"
        title="Documentation"
        description="Component reference generated from shared/catalog.ts — the same metadata the lab and API Explorer use — plus the engineering docs in the repository."
      />
      <Box
        sx={{
          display: 'grid',
          gap: 5,
          gridTemplateColumns: { xs: '1fr', lg: '220px minmax(0, 1fr)' },
          alignItems: 'start',
        }}
      >
        <Box component="nav" aria-label="Documentation sections" sx={{ position: { lg: 'sticky' }, top: 80 }}>
          {CATEGORIES.map((c) => (
            <Box key={c.id} sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary">
                {c.label}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {componentsInCategory(c.id).map((id) => (
                  <li key={id}>
                    <Link href={`#doc-${id}`} sx={{ fontSize: 14, display: 'block', py: 0.5 }}>
                      {CATALOG[id].name}
                    </Link>
                  </li>
                ))}
              </Box>
            </Box>
          ))}
          <Link href="#repo-docs" sx={{ fontSize: 14 }}>
            Engineering docs
          </Link>
        </Box>
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {CATEGORIES.flatMap((c) => componentsInCategory(c.id)).map((id) => {
            const doc = CATALOG[id];
            return (
              <Card
                key={id}
                component="section"
                id={`doc-${id}`}
                aria-labelledby={`doc-${id}-title`}
                sx={{ p: { xs: 4, md: 5 }, scrollMarginTop: 80 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                  <Typography id={`doc-${id}-title`} variant="h2">
                    {doc.name}
                  </Typography>
                  <StatusBadge
                    tone="neutral"
                    label={CATEGORIES.find((c) => c.id === doc.category)!.label}
                    showDot={false}
                  />
                  <Link href={`/components/${id}`} sx={{ ml: 'auto', fontSize: 14 }}>
                    Open in Component Lab
                  </Link>
                </Box>
                <Typography sx={{ mb: 3, maxWidth: 760 }}>{doc.purpose}</Typography>
                <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <DocList
                    title="Props"
                    items={doc.props.map(
                      (p) =>
                        `${p.name}${p.required ? ' (required)' : ''}: ${p.type}${p.default ? ` = ${p.default}` : ''}`,
                    )}
                    mono
                  />
                  <DocList title="Variants and states" items={doc.states} />
                  <DocList title="Accessibility" items={doc.accessibility} />
                  <DocList title="Testing expectations" items={doc.testing} />
                </Box>
              </Card>
            );
          })}
          <Card
            component="section"
            id="repo-docs"
            aria-labelledby="repo-docs-title"
            sx={{ p: { xs: 4, md: 5 }, scrollMarginTop: 80 }}
          >
            <Typography id="repo-docs-title" variant="h2" sx={{ mb: 2 }}>
              Engineering docs (in the repository)
            </Typography>
            <Box
              component="dl"
              sx={{
                m: 0,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(260px, auto) 1fr' },
                columnGap: 4,
                rowGap: 1.5,
              }}
            >
              {REPO_DOCS.map((d) => (
                <Box key={d.file} sx={{ display: 'contents' }}>
                  <Box component="dt" sx={{ fontFamily: 'monospace', fontSize: 13 }}>
                    {d.file}
                  </Box>
                  <Box component="dd" sx={{ m: 0, fontSize: 14, color: 'text.secondary', mb: { xs: 1.5, md: 0 } }}>
                    {d.about}
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
}

function DocList({ title, items, mono = false }: { title: string; items: string[]; mono?: boolean }) {
  return (
    <Box>
      <Typography variant="h4" component="h3" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 4, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {items.map((i) => (
          <Typography
            key={i}
            component="li"
            variant="body2"
            sx={mono ? { fontFamily: 'monospace', fontSize: 12.5 } : undefined}
          >
            {i}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
