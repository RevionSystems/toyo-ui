import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { CATALOG, CATEGORIES, componentsInCategory, type ComponentId } from '@shared/catalog';

const BADGES = [
  { label: 'Accessible', icon: <AccessibilityNewOutlinedIcon /> },
  { label: 'TypeScript', icon: <CodeOutlinedIcon /> },
  { label: 'Tested', icon: <FactCheckOutlinedIcon /> },
  { label: 'Themeable', icon: <PaletteOutlinedIcon /> },
];

/**
 * Compact component header over brand imagery. Always dark (the image is dark), in both
 * schemes, so its text colors are fixed rather than theme-driven.
 */
export function LabBanner({ id }: { id: ComponentId }) {
  const doc = CATALOG[id];
  const category = CATEGORIES.find((c) => c.id === doc.category)!;
  const siblings = componentsInCategory(doc.category);

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: '#141518',
        color: '#FFFFFF',
        px: { xs: 4, md: 6 },
        py: { xs: 4, md: 5 },
        mb: 4,
      }}
    >
      <Box
        component="img"
        src="/img/banner-car.jpg"
        alt=""
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: { xs: '100%', md: '62%' },
          objectFit: 'cover',
          objectPosition: 'right center',
          opacity: { xs: 0.25, md: 1 },
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #141518 30%, rgba(20,21,24,0.85) 50%, rgba(20,21,24,0) 80%)',
        }}
      />
      <Box sx={{ position: 'relative', maxWidth: 720 }}>
        <Breadcrumbs
          aria-label="Breadcrumb"
          sx={{ fontSize: 13, color: '#C4C8CE', '& .MuiBreadcrumbs-separator': { color: '#C4C8CE' } }}
        >
          <Link href="/" sx={{ color: '#C4C8CE' }}>
            Components
          </Link>
          <Link href={`/components/${siblings[0]}`} sx={{ color: '#C4C8CE' }}>
            {category.label}
          </Link>
          <Typography aria-current="page" sx={{ fontSize: 13, color: '#FFFFFF', fontWeight: 600 }}>
            {doc.name}
          </Typography>
        </Breadcrumbs>
        <Typography variant="display" component="h1" sx={{ mt: 2, mb: 1.5, fontSize: { xs: 30, md: 40 } }}>
          {doc.name}
        </Typography>
        <Typography sx={{ color: '#D9DCE0', fontSize: 15, mb: 3 }}>{doc.summary}</Typography>
        <Box
          component="ul"
          aria-label="Quality attributes"
          sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', listStyle: 'none', m: 0, p: 0 }}
        >
          {BADGES.map((b) => (
            <li key={b.label}>
              <Chip
                size="small"
                icon={b.icon}
                label={b.label}
                variant="outlined"
                sx={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.35)',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  '& .MuiChip-icon': { color: '#FFFFFF', fontSize: 15 },
                }}
              />
            </li>
          ))}
        </Box>
      </Box>
      {siblings.length > 1 && (
        <Box
          component="nav"
          aria-label={`${category.label} components`}
          sx={{ position: 'relative', mt: 4, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}
        >
          {siblings.map((sid) => (
            <Chip
              key={sid}
              component="a"
              href={`/components/${sid}`}
              clickable
              label={CATALOG[sid].name}
              aria-current={sid === id ? 'page' : undefined}
              sx={
                sid === id
                  ? { bgcolor: '#FFFFFF', color: '#141518', fontWeight: 600, '&:hover': { bgcolor: '#FFFFFF' } }
                  : {
                      color: '#FFFFFF',
                      bgcolor: 'rgba(255,255,255,0.12)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    }
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
