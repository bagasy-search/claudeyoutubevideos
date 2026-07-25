/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Ruta al manifiesto de arte externo. Sin definir, se usa el arte procedural. */
  readonly VITE_ART_MANIFEST?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
