import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isMacOs = () => {
  if (typeof window === "undefined") return false;
  return window.navigator.userAgent.includes("Mac");
};

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const EXCLUDED_FILES = [
  "/public/index.html",
  "/package.json",
  "/styles.css",
  "/tsconfig.json",
];
