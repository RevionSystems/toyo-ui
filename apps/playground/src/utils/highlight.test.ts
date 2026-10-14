import { describe, expect, it } from 'vitest';
import { highlight } from './highlight';

const kinds = (code: string) =>
  highlight(code)
    .filter((t) => t.kind !== 'text')
    .map((t) => [t.kind, t.value]);

describe('highlight', () => {
  it('round-trips the input exactly', () => {
    const code = 'import { Button } from \'@toyo-ui/react\';\n<Button size="small">Go</Button> // done';
    expect(
      highlight(code)
        .map((t) => t.value)
        .join(''),
    ).toBe(code);
  });

  it('classifies keywords, strings, tags, attributes and comments', () => {
    expect(kinds('const a = \'x\'; <Button variant="text" /> // c')).toEqual([
      ['keyword', 'const'],
      ['string', "'x'"],
      ['tag', '<Button'],
      ['attr', 'variant'],
      ['string', '"text"'],
      ['tag', '/>'],
      ['comment', '// c'],
    ]);
  });

  it('treats markup inside strings as string text, not tags', () => {
    expect(kinds('"<script>alert(1)</script>"')).toEqual([['string', '"<script>alert(1)</script>"']]);
  });
});
