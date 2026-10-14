import { createContext, useContext } from 'react';

/**
 * The preview frame element. Overlays (Dialog) portal into it so they inherit the preview's
 * color scheme instead of the page's. `null` until the frame mounts.
 */
export const PreviewContainerContext = createContext<HTMLElement | null>(null);
export const usePreviewContainer = () => useContext(PreviewContainerContext);
