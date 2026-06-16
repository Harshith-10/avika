import { ArrowRight, CircleHelp } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/blocks/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle pill size="lg" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to Avika Mind Hub</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Where Technology Meets Therapy
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="lg">
            Learn More <CircleHelp />
          </Button>
          <Button size="lg" asChild>
            <Link href="/about">
              Get Started <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
