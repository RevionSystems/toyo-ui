import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { layout } from '@/theme/tokens';
import { ColorModeToggle } from './ColorModeToggle';
import { CommandSearch } from './CommandSearch';
import { SideNav } from './SideNav';
import { Wordmark } from './Wordmark';

export function AppShell() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));
  // One search instance only: it owns the global ⌘K shortcut.
  const wideHeader = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Move focus to main content on route change so screen-reader users hear the new page.
  // Compare against the previous path (not a "first render" flag) so StrictMode's double
  // effect invocation doesn't steal focus on initial load.
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Link
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        sx={{
          position: 'absolute',
          left: 8,
          top: -48,
          zIndex: 2000,
          bgcolor: 'background.paper',
          px: 3,
          py: 2,
          borderRadius: 1,
          '&:focus': { top: 8 },
        }}
      >
        Skip to main content
      </Link>

      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: 'none',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ gap: 4, px: { xs: 3, md: 5 }, minHeight: { xs: layout.topbarHeight } }}>
          {!desktop && (
            <IconButton edge="start" aria-label="Open navigation" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Link
              href="/"
              underline="none"
              aria-label="Toyo-ui component library overview"
              sx={{ color: 'text.primary' }}
            >
              <Wordmark size={desktop ? 'md' : 'sm'} />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'block' }, borderLeft: 1, borderColor: 'divider', pl: 4 }}>
              <Typography component="p" sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
                Component Engineering Lab
              </Typography>
              <Typography component="p" sx={{ fontSize: 12, color: 'text.secondary' }}>
                Build. Explore. Test.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
            {wideHeader && <CommandSearch />}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            <ColorModeToggle />
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'text.primary',
                color: 'background.paper',
                fontSize: 12,
                fontWeight: 700,
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              EV
            </Avatar>
            <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Evian Valdez</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Frontend Engineer</Typography>
            </Box>
          </Box>
        </Toolbar>
        {!wideHeader && (
          <Box sx={{ px: 3, pb: 2.5 }}>
            <CommandSearch />
          </Box>
        )}
      </AppBar>

      <Drawer
        variant={desktop ? 'permanent' : 'temporary'}
        open={desktop || open}
        onClose={() => setOpen(false)}
        sx={{ width: layout.sidebarWidth, flexShrink: 0 }}
        slotProps={{
          paper: {
            sx: {
              width: layout.sidebarWidth,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              top: desktop ? layout.topbarHeight : 0,
              height: desktop ? `calc(100% - ${layout.topbarHeight}px)` : '100%',
            },
          },
        }}
      >
        <SideNav onNavigate={desktop ? undefined : () => setOpen(false)} />
      </Drawer>

      <Box
        component="main"
        id="main"
        ref={mainRef}
        tabIndex={-1}
        sx={{
          flex: 1,
          minWidth: 0,
          outline: 'none',
          pt: { xs: `${layout.topbarHeight + 56}px`, md: `${layout.topbarHeight}px` },
        }}
      >
        <Box sx={{ maxWidth: layout.contentMaxWidth, mx: 'auto', p: { xs: 3, md: 5 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
