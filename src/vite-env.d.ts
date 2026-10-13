/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional backend proxy for the AI assistant. Unset → offline deterministic engine. */
  readonly VITE_ASSISTANT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
