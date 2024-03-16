"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const OptionMode = [
  {
    value: "light",
    label: "Light",
    icon: SunIcon,
  },
  {
    value: "dark",
    label: "Dark",
    icon: MoonIcon,
  },
  {
    value: "system",
    label: "System",
    icon: LaptopIcon,
  },
] satisfies { value: string; label: string; icon: any }[];

type ModeToggleProps = {
  isDesktop?: boolean;
};

export function ModeToggle({ isDesktop = true }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  return mounted ? (
    isDesktop ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-9">
            <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-0.5">
          {OptionMode.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex items-center gap-2",
                  theme === option.value && "bg-accent"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="size-9 flex gap-2 w-full justify-start"
      >
        <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 size-4" />
        <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 size-4" />
        <span>{theme}</span>
      </Button>
    )
  ) : (
    <div className="animate-pulse rounded-md bg-primary/10 size-9" />
  );
}
