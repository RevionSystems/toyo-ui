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
import { Wordmark } from '@/components';
import { layout } from '@/theme/tokens';
import { GlobalSearch } from './GlobalSearch';
import { SideNav } from './SideNav';

export function AppShell() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Move focus to main content on route change so screen-reader users hear the new page.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
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

      <AppBar position="fixed" color="inherit" sx={{ zIndex: (t) => t.zIndex.drawer + 1, borderBottom: 1, borderColor: 'divider', boxShadow: 'none', bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 4, px: { xs: 3, md: 6 } }}>
          {!desktop && (
            <IconButton edge="start" aria-label="Open navigation" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Link href="/" underline="none" color="inherit" aria-label="Toyo-ui Engineering Hub home" sx={{ minWidth: 0, flexShrink: 0 }}>
            <Wordmark product="Engineering Hub" tagline="Engineering knowledge & component platform" size={desktop ? 'md' : 'sm'} />
          </Link>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
            <Box sx={{ width: '100%', maxWidth: 560, display: { xs: 'none', md: 'block' } }}>
              <GlobalSearch />
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'text.primary', color: 'background.paper', fontSize: 13, fontWeight: 700 }}>AT</Avatar>
            <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Alex Tanaka</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Frontend Engineer</Typography>
            </Box>
          </Box>
        </Toolbar>
        <Box sx={{ display: { xs: 'block', md: 'none' }, px: 3, pb: 3 }}>
          <GlobalSearch />
        </Box>
      </AppBar>

      <Drawer
        variant={desktop ? 'permanent' : 'temporary'}
        open={desktop || open}
        onClose={() => setOpen(false)}
        sx={{ width: layout.sidebarWidth, flexShrink: 0 }}
        slotProps={{
          paper: {
            sx: { width: layout.sidebarWidth, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper', top: desktop ? layout.topbarHeight : 0, height: desktop ? `calc(100% - ${layout.topbarHeight}px)` : '100%' },
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
          pt: { xs: `${layout.topbarHeight + 64}px`, md: `${layout.topbarHeight}px` },
        }}
      >
        <Box sx={{ maxWidth: layout.contentMaxWidth, mx: 'auto', px: { xs: 4, md: 8 }, py: { xs: 6, md: 8 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
