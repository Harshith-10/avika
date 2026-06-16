"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { useContext, useRef } from "react";

// --- Types for our Animation Suite ---
export type TransitionType =
  | "fade"
  | "scale"
  | "slide"
  | "flip"
  | "blur"
  | "zoom-spin";
export type Direction = "up" | "down" | "left" | "right" | "none";

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  direction?: Direction;
  duration?: number;
}

// 1. The Context Hack (Kept intact to prevent layout snaps)
function FrozenRoute({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

// 2. The Variants Engine
// This function dynamically generates the animation states based on props
const getVariants = (type: TransitionType, direction: Direction): Variants => {
  const distance = 100; // The pixel distance for slides

  // Calculate positional offsets based on direction
  const x =
    direction === "left" ? distance : direction === "right" ? -distance : 0;
  const y =
    direction === "up" ? distance : direction === "down" ? -distance : 0;

  const exitX =
    direction === "left" ? -distance : direction === "right" ? distance : 0;
  const exitY =
    direction === "up" ? -distance : direction === "down" ? distance : 0;

  switch (type) {
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case "scale": // Your original, polished
      return {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.15 },
      };
    case "slide":
      return {
        initial: { opacity: 0, x, y },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: exitX, y: exitY },
      };
    case "flip": // 3D rotation logic
      {
        const rotateXInitial =
          direction === "up" ? 90 : direction === "down" ? -90 : 0;
        const rotateYInitial =
          direction === "left" ? 90 : direction === "right" ? -90 : 0;
        return {
          initial: {
            opacity: 0,
            rotateX: rotateXInitial,
            rotateY: rotateYInitial,
          },
          animate: { opacity: 1, rotateX: 0, rotateY: 0 },
          exit: {
            opacity: 0,
            rotateX: direction === "up" ? -90 : direction === "down" ? 90 : 0,
            rotateY:
              direction === "left" ? -90 : direction === "right" ? 90 : 0,
          },
        };
      }
    case "blur": // Modern Apple-style blur fade
      return {
        initial: { opacity: 0, filter: "blur(20px)" },
        animate: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: "blur(20px)" },
      };
    case "zoom-spin": // The wild card
      return {
        initial: { opacity: 0, scale: 0.2, rotate: -180 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        exit: { opacity: 0, scale: 2, rotate: 180 },
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
};

export default function PageTransition({
  children,
  type = "slide", // Default type
  direction = "left", // Default direction
  duration = 0.6, // Default duration
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        variants={getVariants(type, direction)}
        initial="initial"
        animate="animate"
        exit="exit"
        // Using a custom cubic-bezier for a more premium, native-feeling ease
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        // Added `[perspective:1000px]` to support the 3D flip animation properly
        className="col-start-1 row-start-1 w-full h-full [perspective:1000px]"
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
}
