"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Resolved on the client only, so the prerendered shell never bakes in a build-time date. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year}</>;
}
