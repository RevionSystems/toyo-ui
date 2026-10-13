import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { ColorModeToggle } from './ColorModeToggle';
import { NAV, type NavItem } from './navigation';

const isActive = (item: NavItem, pathname: string) =>
  item.matchPrefix ? pathname === item.href || pathname.startsWith(`${item.href}/`) : pathname === item.href;

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box component="nav" aria-label="Primary" sx={{ flex: 1, overflowY: 'auto', px: 3, py: 4 }}>
        {NAV.map((group, gi) => (
          <List
            key={group.label ?? gi}
            dense
            disablePadding
            sx={{ mb: 3 }}
            subheader={
              group.label ? (
                <ListSubheader disableSticky sx={{ bgcolor: 'transparent', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: '32px', px: 3 }}>
                  {group.label}
                </ListSubheader>
              ) : undefined
            }
          >
            {group.items.map((item) => {
              const active = isActive(item, pathname);
              return (
                <ListItem key={item.href} disablePadding>
                <ListItemButton
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    py: 1.5,
                    position: 'relative',
                    color: active ? 'primary.main' : 'text.primary',
                    bgcolor: active ? 'surfaceMuted' : 'transparent',
                    '&::before': active
                      ? { content: '""', position: 'absolute', left: -12, top: 6, bottom: 6, width: 3, bgcolor: 'primary.main', borderRadius: 2 }
                      : undefined,
                  }}
                >
                  <ListItemIcon aria-hidden sx={{ minWidth: 34, color: active ? 'primary.main' : 'text.secondary', '& svg': { fontSize: 20 } }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: active ? 600 : 400 } } }} />
                </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ))}
      </Box>
      <Box sx={{ p: 4, borderTop: 1, borderColor: 'divider' }}>
        <ColorModeToggle />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontSize: 12 }}>
          Engineering Hub v0.1.0
          <br />
          Synthetic data · portfolio demo
        </Typography>
      </Box>
    </Box>
  );
}
