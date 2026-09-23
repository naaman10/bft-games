/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BFT_API_URL?: string;
  readonly VITE_PARENT_ORIGINS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
