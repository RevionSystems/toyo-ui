import { describe, expect, it } from 'vitest';
import { extractPublicTypes, loadPublicTypes } from './source';

describe('extractPublicTypes', () => {
  it('keeps exported types and interfaces with their JSDoc, and drops implementation', () => {
    const src = [
      "import x from 'y';",
      "export type Size = 'sm' | 'md';",
      'type Internal = string;',
      '/** Props. */',
      'export interface FooProps {',
      '  /** Size. */',
      '  size?: Size;',
      '}',
      'export function Foo() {}',
    ].join('\n');
    expect(extractPublicTypes(src)).toBe(
      [
        "export type Size = 'sm' | 'md';",
        '',
        '/** Props. */',
        'export interface FooProps {',
        '  /** Size. */',
        '  size?: Size;',
        '}',
      ].join('\n'),
    );
  });
});

describe('loadPublicTypes', () => {
  it('reads the real Button source', async () => {
    const types = await loadPublicTypes('Button');
    expect(types).toContain('export interface ButtonProps extends Omit<MuiButtonProps, OmittedMuiProps>');
    expect(types).toContain("export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';");
    expect(types).not.toContain('VARIANT_MAP');
  });
});
