import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { Eyebrow } from './Eyebrow';

export interface DomainCardProps {
  /** Position in the sequence, rendered as "01". */
  index?: number;
  overline: string;
  title: string;
  description: string;
  image: string;
  /** Alt text; pass an empty string when the image is decorative. */
  imageAlt?: string;
  /** Short facts rendered in the footer, separated by dots. */
  meta?: string[];
  href: string;
}

/** Navigational card for a top-level knowledge domain. The whole card is one link. */
export function DomainCard({ index, overline, title, description, image, imageAlt = '', meta = [], href }: DomainCardProps) {
  return (
    <Card sx={{ height: '100%', transition: 'border-color 200ms, box-shadow 200ms', '&:hover': { borderColor: 'text.secondary' } }}>
      <CardActionArea href={href} sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Eyebrow index={index} component="span">{overline}</Eyebrow>
          <ArrowForwardIcon aria-hidden sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <Box
          component="img"
          src={image}
          alt={imageAlt}
          loading="lazy"
          sx={{ width: '100%', aspectRatio: '2 / 1', objectFit: 'cover', borderRadius: 1, bgcolor: 'surfaceMuted', display: 'block' }}
        />
        <Typography variant="h3" component="h3" sx={{ mt: 4, mb: 1.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {description}
        </Typography>
        {meta.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontSize: 12 }}>
            {meta.join('  ·  ')}
          </Typography>
        )}
      </CardActionArea>
    </Card>
  );
}
