import { BrowserProvider, Eip1193Provider } from "ethers/types/providers";

/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum?: BrowserProvider & Eip1193Provider;
  }
}
