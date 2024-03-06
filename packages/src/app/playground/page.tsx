"use client";

import { Suspense, lazy } from "react";

const Playground = lazy(() => import("@/components/playground"));

export default function PlaygroundPage() {
  return (
    <main className="flex items-center justify-center size-full px-4 py-1">
      <Suspense fallback={<div className="">Loading...</div>}>
        <Playground />
      </Suspense>
    </main>
  );
}
