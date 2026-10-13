import { describe, expect, it } from 'vitest';
import { example, jsx, raw } from './jsx';

describe('jsx', () => {
  it('serializes primitives and omits falsy and default props', () => {
    expect(jsx('StatusBadge', { status: 'success', size: 'small' }, { defaults: { size: 'small' } })).toBe(
      '<StatusBadge status="success" />',
    );
    expect(jsx('Button', { fullWidth: true, disabled: false, tabIndex: 2 }, { children: 'Save' })).toBe(
      '<Button fullWidth tabIndex={2}>\n  Save\n</Button>',
    );
  });

  it('wraps long prop lists onto separate lines', () => {
    const out = jsx('Alert', {
      severity: 'warning',
      title: 'Revision pending review',
      action: raw('<Button>Review</Button>'),
    });
    expect(out.split('\n')[0]).toBe('<Alert');
    expect(out).toContain('  action={<Button>Review</Button>}');
    expect(out.endsWith('/>')).toBe(true);
  });
});

describe('example', () => {
  it('produces a complete component with sorted, de-duplicated imports', () => {
    const code = example({
      components: ['Button', 'Alert', 'Button'],
      imports: ["import SaveIcon from '@mui/icons-material/Save';"],
      setup: ['const [open, setOpen] = useState(false);'],
      element: '<Button>\n  Save\n</Button>',
    });
    expect(code).toBe(
      [
        "import { Alert, Button } from '@/components/ui';",
        "import SaveIcon from '@mui/icons-material/Save';",
        '',
        'export function Example() {',
        '  const [open, setOpen] = useState(false);',
        '  return (',
        '    <Button>',
        '      Save',
        '    </Button>',
        '  );',
        '}',
        '',
      ].join('\n'),
    );
  });
});
