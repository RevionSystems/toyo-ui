import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

// Playground tests render whole routes (shell, lab, explorers). On shared CI runners with four projects in
// parallel a full render can exceed Testing Library's 1 s default. Package unit tests keep the defaults.
configure({ asyncUtilTimeout: 5000 });

// jsdom does not implement matchMedia; MUI's useMediaQuery and color scheme code need it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
window.scrollTo = () => {};

// axe-core probes <canvas>, which jsdom does not implement; return null instead of logging noise.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
