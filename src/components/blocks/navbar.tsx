import { Sunrise } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import CornerBoxes from "./corner-boxes";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full z-20 px-16">
      <div className="relative flex items-center justify-between py-4 px-6 h-20 w-full backdrop-blur-md bg-background/50 border-l border-r border-b">
        <div className="flex items-center gap-4">
          <Sunrise className="w-8 h-8" />
          <div className="text-xl font-bold">AVIKA</div>
          <div className="flex rounded-full bg-muted/80 p-2 ml-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle size="xl" />
        </div>
        <CornerBoxes />
      </div>
    </div>
  );
}
