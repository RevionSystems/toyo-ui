import { lazy, Suspense, type ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { AppShell } from '@/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ManualsPage } from '@/pages/ManualsPage';
import { ManualDetailPage } from '@/pages/ManualDetailPage';
import { PartsPage } from '@/pages/PartsPage';
import { PartDetailPage } from '@/pages/PartDetailPage';
import { SuppliersPage } from '@/pages/SuppliersPage';
import { SupplierDetailPage } from '@/pages/SupplierDetailPage';
import { SystemsPage } from '@/pages/SystemsPage';
import { SystemDetailPage } from '@/pages/SystemDetailPage';
import { ManufacturingPage } from '@/pages/ManufacturingPage';
import { AssistantPage } from '@/pages/AssistantPage';

// Platform pages are code-split: most portal users never open them.
const ComponentLabPage = lazy(() => import('@/pages/ComponentLabPage'));
const DesignTokensPage = lazy(() => import('@/pages/DesignTokensPage'));
const AccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));

const suspend = (node: ReactNode) => (
  <Suspense fallback={<LinearProgress aria-label="Loading page" />}>{node}</Suspense>
);

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'systems', element: <SystemsPage /> },
      { path: 'systems/:systemId', element: <SystemDetailPage /> },
      { path: 'manuals', element: <ManualsPage /> },
      { path: 'manuals/:manualId', element: <ManualDetailPage /> },
      { path: 'parts', element: <PartsPage /> },
      { path: 'parts/:partId', element: <PartDetailPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'suppliers/:supplierId', element: <SupplierDetailPage /> },
      { path: 'manufacturing', element: <ManufacturingPage /> },
      { path: 'assistant', element: <AssistantPage /> },
      { path: 'lab', element: suspend(<ComponentLabPage />) },
      { path: 'lab/:componentId', element: suspend(<ComponentLabPage />) },
      { path: 'tokens', element: suspend(<DesignTokensPage />) },
      { path: 'accessibility', element: suspend(<AccessibilityPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
