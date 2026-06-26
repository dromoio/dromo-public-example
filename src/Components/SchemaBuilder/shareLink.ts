import { BuilderField, BuilderSettings } from "./types";

export interface ShareableState {
  fields: BuilderField[];
  importIdentifier: string;
  settings: BuilderSettings;
  selectedTheme: string;
  enabledHookKeys: string[];
}

const SHARE_PARAM = "schema";

export const encodeShareState = (state: ShareableState): string =>
  btoa(encodeURIComponent(JSON.stringify(state)));

export const decodeShareState = (encoded: string): ShareableState | null => {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
};

export const buildShareUrl = (state: ShareableState): string => {
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encodeShareState(state));
  return url.toString();
};

export const readShareStateFromLocation = (): ShareableState | null => {
  const encoded = new URLSearchParams(window.location.search).get(SHARE_PARAM);
  return encoded ? decodeShareState(encoded) : null;
};
