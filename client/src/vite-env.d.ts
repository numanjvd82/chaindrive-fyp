import { BrowserProvider, Eip1193Provider } from "ethers/types/providers";

/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum?: BrowserProvider & Eip1193Provider;
  }

  interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string;
    // add other env variables here as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
