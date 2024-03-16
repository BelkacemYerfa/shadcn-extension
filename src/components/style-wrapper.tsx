"use client";

import * as React from "react";

import { Style } from "@/registry/styles";

interface StyleWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  styleName?: Style["name"];
}

export function StyleWrapper({ styleName, children }: StyleWrapperProps) {
  const config = {
    style: "default",
  };

  if (!styleName || config.style === styleName) {
    return <>{children}</>;
  }

  return null;
}
