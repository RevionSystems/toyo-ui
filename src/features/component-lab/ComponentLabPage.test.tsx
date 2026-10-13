import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/routes';
import { axeViolations } from '@/test/axe';
import { renderRoutes } from '@/test/render';

const playground = () => screen.getByRole('region', { name: 'Playground' });
const codeText = () => screen.getByLabelText(/usage example/i).textContent ?? '';

async function selectOption(user: ReturnType<typeof userEvent.setup>, label: string, option: string) {
  await user.click(screen.getByRole('combobox', { name: label }));
  await user.click(await screen.findByRole('option', { name: option }));
}

describe('Component Lab — Button', () => {
  it('renders the component header, preview, properties and generated code', async () => {
    const { container } = renderRoutes(routes, '/components/button');
    expect(await screen.findByRole('heading', { level: 1, name: 'Button' })).toBeInTheDocument();
    expect(within(playground()).getByRole('button', { name: 'Create Component' })).toBeInTheDocument();
    expect(codeText()).toContain("import { Button } from '@/components/ui';");
    expect(await axeViolations(container)).toEqual([]);
  });

  it('keeps preview and code in sync when properties change', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/components/button');
    await screen.findByRole('heading', { level: 1, name: 'Button' });

    await selectOption(user, 'variant', 'outline');
    expect(within(playground()).getByRole('button')).toHaveClass('MuiButton-outlined');
    expect(codeText()).toContain('variant="outline"');

    await selectOption(user, 'start icon', 'Download');
    expect(codeText()).toContain("import DownloadIcon from '@mui/icons-material/Download';");
    expect(codeText()).toContain('startIcon={<DownloadIcon />}');

    const text = screen.getByRole('textbox', { name: 'button text' });
    await user.clear(text);
    await user.type(text, 'Export');
    expect(within(playground()).getByRole('button', { name: 'Export' })).toBeInTheDocument();
    expect(codeText()).toMatch(/>\s+Export\s+<\/Button>/);

    await user.click(screen.getByRole('switch', { name: 'loading' }));
    expect(within(playground()).getByRole('button', { name: 'Export' })).toHaveAttribute('aria-busy', 'true');
    expect(codeText()).toMatch(/\bloading\b/);
  });

  it('omits default values from the code and restores defaults on reset', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/components/button');
    await screen.findByRole('heading', { level: 1, name: 'Button' });
    expect(codeText()).not.toContain('variant=');
    expect(codeText()).not.toContain('size=');

    await selectOption(user, 'size', 'large');
    expect(codeText()).toContain('size="large"');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(codeText()).not.toContain('size=');
    expect(screen.getByRole('combobox', { name: 'size' })).toHaveTextContent('medium');
  });

  it('shows the real TypeScript declarations in the API tab', async () => {
    const user = userEvent.setup();
    renderRoutes(routes, '/components/button');
    await user.click(await screen.findByRole('tab', { name: 'API' }));
    const decl = await screen.findByLabelText('Button type declarations');
    expect(decl).toHaveTextContent('export interface ButtonProps extends Omit<MuiButtonProps, OmittedMuiProps>');
    expect(screen.getByRole('table', { name: 'Button props' })).toBeInTheDocument();
  });

  it('shows a not-found page for unknown components', async () => {
    renderRoutes(routes, '/components/carousel');
    expect(await screen.findByRole('heading', { level: 1, name: 'Component not found' })).toBeInTheDocument();
  });
});
