import LinearProgress from '@mui/material/LinearProgress';
import { lazy, Suspense, type ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import ComponentLabPage from '@/features/component-lab/ComponentLabPage';
import OverviewPage from '@/features/component-library/OverviewPage';
import { NotFoundPage } from './NotFoundPage';

// The Component Lab is the primary surface and loads eagerly; secondary pages are code-split.
const TokensPage = lazy(() => import('@/features/foundations/TokensPage'));
const TypographyPage = lazy(() => import('@/features/foundations/TypographyPage'));
const SpacingPage = lazy(() => import('@/features/foundations/SpacingPage'));
const ThemePage = lazy(() => import('@/features/foundations/ThemePage'));
const AccessibilityPage = lazy(() => import('@/features/foundations/AccessibilityPage'));
const ApiExplorerPage = lazy(() => import('@/features/documentation/ApiExplorerPage'));
const TestExplorerPage = lazy(() => import('@/features/documentation/TestExplorerPage'));
const DocumentationPage = lazy(() => import('@/features/documentation/DocumentationPage'));

const suspend = (node: ReactNode) => (
  <Suspense fallback={<LinearProgress aria-label="Loading page" />}>{node}</Suspense>
);

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'components/:componentId', element: <ComponentLabPage /> },
      { path: 'foundations/tokens', element: suspend(<TokensPage />) },
      { path: 'foundations/typography', element: suspend(<TypographyPage />) },
      { path: 'foundations/spacing', element: suspend(<SpacingPage />) },
      { path: 'foundations/theme', element: suspend(<ThemePage />) },
      { path: 'foundations/accessibility', element: suspend(<AccessibilityPage />) },
      { path: 'engineering/api', element: suspend(<ApiExplorerPage />) },
      { path: 'engineering/tests', element: suspend(<TestExplorerPage />) },
      { path: 'engineering/docs', element: suspend(<DocumentationPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
