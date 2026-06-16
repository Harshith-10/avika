"use client";

import {
  ScrollArea as ArkScrollArea,
  useScrollAreaContext,
} from "@ark-ui/react/scroll-area";
import Lenis from "lenis"; // Import Lenis directly
import type React from "react"; // Added useEffect and useRef
import { useEffect, useRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

export const useScrollArea = useScrollAreaContext;

const scrollAreaVariants = tv({
  base: [
    "h-full",
    "rounded-[inherit]",
    "outline-none",
    "scrollbar-none",
    "outline-none",
  ],
  variants: {
    scrollFade: {
      true: [
        "mask-t-from-[calc(100%-var(--fade-size))]",
        "mask-b-from-[calc(100%-var(--fade-size))]",
        "data-at-top:mask-t-from-100%",
        "data-at-bottom:mask-b-from-100%",
        "transition-shadow",
        "motion-reduce:transition-none!",
      ],
    },
  },
  defaultVariants: {
    scrollFade: false,
  },
});

interface ScrollAreaProps
  extends React.ComponentProps<typeof ArkScrollArea.Root>,
    VariantProps<typeof scrollAreaVariants> {}

export const ScrollArea = (props: ScrollAreaProps) => {
  const { scrollFade = false, className, children, ...rest } = props;

  // 1. Create references for the scrollable viewport and its content
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 2. Initialize Lenis inside a useEffect hook
  useEffect(() => {
    if (!viewportRef.current || !contentRef.current) return;

    // Attach Lenis exclusively to this custom scroll container
    const lenis = new Lenis({
      wrapper: viewportRef.current,
      content: contentRef.current,
      lerp: 0.1, // Controls the smoothness (lower = smoother/slower)
      wheelMultiplier: 1, // Controls the scroll speed
      smoothWheel: true,
    });

    // 3. Set up the RequestAnimationFrame loop required by Lenis
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 4. Cleanup the loop and instance on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <ArkScrollArea.Root
      className={cn("size-full min-h-0 [--fade-size:1.5rem]", className)}
      data-slot="scroll-area"
      {...rest}
    >
      {/* 5. Pass the refs directly to the Ark UI elements */}
      <ArkScrollArea.Viewport
        ref={viewportRef}
        className={cn(scrollAreaVariants({ scrollFade }))}
        data-slot="scroll-area-viewport"
      >
        <ArkScrollArea.Content ref={contentRef} data-slot="scroll-area-content">
          {children}
        </ArkScrollArea.Content>
      </ArkScrollArea.Viewport>

      <ScrollAreaScrollbar orientation="vertical" />
      <ScrollAreaScrollbar orientation="horizontal" />

      <ArkScrollArea.Corner data-slot="scroll-area-corner" />
    </ArkScrollArea.Root>
  );
};

export const ScrollAreaScrollbar = (
  props: React.ComponentProps<typeof ArkScrollArea.Scrollbar>,
) => {
  const { orientation, className, ...rest } = props;

  return (
    <ArkScrollArea.Scrollbar
      className={cn(
        "flex",
        "m-1",
        "bg-transparent",
        "opacity-0 transition-opacity delay-300",
        "data-[orientation=vertical]:w-1.5",
        "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:flex-col",
        "data-hover:opacity-100 data-hover:delay-0 data-hover:duration-100",
        "data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100",
        "data-[orientation=vertical]:in-[[data-slot=scroll-area]:not([data-overflow-y])]:hidden",
        "data-[orientation=horizontal]:in-[[data-slot=scroll-area]:not([data-overflow-x])]:hidden",
        "motion-reduce:transition-none!",
        className,
      )}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...rest}
    >
      <ArkScrollArea.Thumb
        className="relative flex-1 rounded-full bg-foreground/20"
        data-slot="scroll-area-thumb"
      />
    </ArkScrollArea.Scrollbar>
  );
};
