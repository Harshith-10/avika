"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ThemeToggleProps {
  pill?: boolean;
  showText?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function ThemeToggle({
  pill = false,
  showText = false,
  size = "md",
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton className={`h-10 rounded-md ${showText ? "w-36" : "w-10"}`} />
    );
  }

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size={showText ? size : `icon-${size}`}
      variant="outline"
      className={pill ? "rounded-full" : undefined}
    >
      {showText && (resolvedTheme === "dark" ? "Light Mode" : "Dark Mode")}
      {resolvedTheme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
