import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { ToyoThemeProvider } from '@toyo-ui/theme';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createReleaseApi } from './releases';

let outage = false;
const api = createReleaseApi({ failing: () => outage });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToyoThemeProvider>
      <App api={api} outage={{ get: () => outage, set: (on) => (outage = on) }} />
    </ToyoThemeProvider>
  </StrictMode>,
);
