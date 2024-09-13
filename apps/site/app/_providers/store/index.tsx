"use client";

import { Provider } from "jotai";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
