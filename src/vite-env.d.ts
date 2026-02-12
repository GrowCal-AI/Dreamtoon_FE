/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_REPLICATE_API_KEY?: string;
  readonly VITE_STABILITY_API_KEY?: string;
  readonly VITE_RUNWAY_API_KEY?: string;
  readonly VITE_PIKA_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
