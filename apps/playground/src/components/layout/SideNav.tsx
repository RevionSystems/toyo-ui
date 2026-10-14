import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { NAV, type NavItem } from './navigation';
import { Wordmark } from './Wordmark';

const active = (item: NavItem, pathname: string) => (item.isActive ? item.isActive(pathname) : pathname === item.href);

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box component="nav" aria-label="Primary" sx={{ flex: 1, overflowY: 'auto', px: 2, py: 3 }}>
        {NAV.map((group) => (
          <List
            key={group.label}
            dense
            disablePadding
            sx={{ mb: 3 }}
            subheader={
              <ListSubheader
                disableSticky
                sx={{
                  bgcolor: 'transparent',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  lineHeight: '28px',
                  px: 2.5,
                  color: 'text.secondary',
                }}
              >
                {group.label}
              </ListSubheader>
            }
          >
            {group.items.map((item) => {
              const isActive = active(item, pathname);
              return (
                <ListItem key={item.href + item.label} disablePadding>
                  <ListItemButton
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    sx={{
                      borderRadius: 1,
                      py: 1.25,
                      px: 2.5,
                      position: 'relative',
                      color: isActive ? 'primaryText' : 'text.primary',
                      bgcolor: isActive ? 'tonal.error' : 'transparent',
                      '&::before': isActive
                        ? {
                            content: '""',
                            position: 'absolute',
                            left: -8,
                            top: 4,
                            bottom: 4,
                            width: 3,
                            bgcolor: 'primary.main',
                            borderRadius: 2,
                          }
                        : undefined,
                    }}
                  >
                    <ListItemIcon
                      aria-hidden
                      sx={{
                        minWidth: 32,
                        color: isActive ? 'primaryText' : 'text.secondary',
                        '& svg': { fontSize: 19 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { sx: { fontSize: 14, fontWeight: isActive ? 600 : 400 } } }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        color="info"
                        variant="outlined"
                        sx={{ height: 20, fontSize: 11 }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ))}
      </Box>
      {/* Decorative; hidden on short viewports so it never crowds the navigation. */}
      <Box sx={{ p: 3, '@media (max-height: 940px)': { display: 'none' } }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: '#0D0E10',
            color: '#FFFFFF',
            p: 3,
            pt: '80px',
          }}
        >
          {/* Decorative imagery; the text below carries the message. */}
          <Box
            component="img"
            src="/img/sidebar-car.jpg"
            alt=""
            sx={{ position: 'absolute', inset: 0, width: '100%', height: 68, objectFit: 'cover' }}
          />
          <Typography sx={{ position: 'relative', fontSize: 15, fontWeight: 600, lineHeight: 1.25, mb: 2 }}>
            Engineering better experiences.
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <Wordmark size="sm" inverse />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
