import type { LeadsManagerApi } from "./preload";

declare global {
  interface Window {
    api: LeadsManagerApi;
  }
}

export {};
