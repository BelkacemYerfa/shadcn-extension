"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/env";

if (typeof window !== "undefined") {
  if (process.env.NODE_ENV === "production") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "development") return <>{children}</>;
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
