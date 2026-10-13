import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';

/** Renders UI inside the app theme and a memory router (MUI links need router context). */
export function renderWithProviders(ui: ReactElement, { route = '/', ...options }: { route?: string } & RenderOptions = {}) {
  const router = createMemoryRouter([{ path: '*', element: ui }], { initialEntries: [route] });
  return { router, ...render(<AppProviders><RouterProvider router={router} /></AppProviders>, options) };
}

/** Renders a real route tree, e.g. the app's `routes`, at a given URL. */
export function renderRoutes(routes: RouteObject[], route = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [route] });
  return { router, ...render(<AppProviders><RouterProvider router={router} /></AppProviders>) };
}

export const Wrapper = ({ children }: { children: ReactNode }) => <AppProviders>{children}</AppProviders>;
