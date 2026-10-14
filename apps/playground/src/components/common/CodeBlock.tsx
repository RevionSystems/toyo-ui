import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import { highlight, type TokenKind } from '@/utils/highlight';

// Code blocks stay dark in both color schemes, like most editors. All colors meet 4.5:1 on the background.
const BG = '#141518';
const COLORS: Record<TokenKind, string> = {
  keyword: '#FF8A93',
  string: '#9FD8A0',
  comment: '#9AA0A8',
  tag: '#82B4FF',
  attr: '#F2C46D',
  number: '#F2C46D',
  text: '#E6E8EB',
};

export interface CodeBlockProps {
  code: string;
  /** Accessible name for the scrollable region. */
  label: string;
  showLineNumbers?: boolean;
  /** Shows a copy button. */
  copyable?: boolean;
  maxHeight?: number;
}

/** Read-only, syntax-highlighted code with line numbers and copy. Renders text only. */
export function CodeBlock({ code, label, showLineNumbers = true, copyable = true, maxHeight }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const source = code.replace(/\n$/, '');
  const tokens = useMemo(() => highlight(source), [source]);
  const lineCount = source.split('\n').length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard unavailable (permissions/insecure origin); the code remains selectable. */
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {copyable && (
        <Button
          size="small"
          onClick={copy}
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            color: '#E6E8EB',
            bgcolor: 'rgba(255,255,255,0.08)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
          }}
        >
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      )}
      <Box sx={{ display: 'flex', bgcolor: BG, borderRadius: 1.5, overflowY: 'auto', overflowX: 'hidden', maxHeight }}>
        {showLineNumbers && (
          // Separate gutter so selecting or copying code never picks up line numbers.
          <Box
            aria-hidden
            sx={{
              py: 3,
              pl: 3,
              pr: 2,
              typography: 'code',
              color: '#7C828A',
              textAlign: 'right',
              userSelect: 'none',
              whiteSpace: 'pre',
              flexShrink: 0,
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => i + 1).join('\n')}
          </Box>
        )}
        <Box
          component="pre"
          tabIndex={0}
          aria-label={label}
          sx={{
            m: 0,
            py: 3,
            pl: showLineNumbers ? 1 : 4,
            pr: copyable ? 24 : 4,
            color: COLORS.text,
            overflowX: 'auto',
            flex: 1,
            typography: 'code',
          }}
        >
          <code>
            {tokens.map((t, i) =>
              t.kind === 'text' ? (
                t.value
              ) : (
                <Box key={i} component="span" sx={{ color: COLORS[t.kind] }}>
                  {t.value}
                </Box>
              ),
            )}
          </code>
        </Box>
      </Box>
    </Box>
  );
}
