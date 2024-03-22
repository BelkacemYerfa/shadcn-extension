"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="size-9">
            <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-full p-1">
          {OptionMode.map((option) => {
            const Icon = option.icon;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex items-center gap-2 w-full relative cursor-default select-none rounded-sm px-3 py-1.5 text-sm outline-none transition-colors focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  theme === option.value && "bg-accent"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
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
