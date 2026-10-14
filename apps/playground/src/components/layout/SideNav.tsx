import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { NAV } from './navigation';

/**
 * Primary navigation: text-only links in labelled sections. The current page is marked with
 * `aria-current="page"`, a neutral background, red text and an edge bar (not color alone).
 */
export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  return (
    <Box component="nav" aria-label="Primary" sx={{ height: '100%', overflowY: 'auto', px: 3, py: 4 }}>
      {NAV.map((group, gi) => (
        <List
          key={group.label ?? gi}
          dense
          disablePadding
          sx={{ mb: 4 }}
          subheader={
            group.label ? (
              <ListSubheader
                disableSticky
                sx={{
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  px: 3,
                  pb: 2,
                }}
              >
                {group.label}
              </ListSubheader>
            ) : undefined
          }
        >
          {group.items.map((item) => {
            const active = pathname === item.href;
            return (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    position: 'relative',
                    borderRadius: 1,
                    minHeight: 34,
                    px: 3,
                    py: 0.75,
                    gap: 2,
                    fontSize: 14,
                    color: active ? 'primaryText' : 'text.primary',
                    fontWeight: active ? 600 : 400,
                    bgcolor: active ? 'surfaceMuted' : 'transparent',
                    '&:hover': { bgcolor: 'surfaceMuted' },
                    '&::before': active
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 6,
                          bottom: 6,
                          width: 2,
                          borderRadius: 1,
                          bgcolor: 'primary.main',
                        }
                      : undefined,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {item.label}
                  </Box>
                  {item.badge && (
                    <Typography component="span" sx={{ fontSize: 11, fontWeight: 500, color: 'text.secondary' }}>
                      {item.badge}
                    </Typography>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      ))}
    </Box>
  );
}
