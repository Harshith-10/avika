import { ArrowRight, Clock, Shield, Users } from "lucide-react";
import Link from "next/link";
import FluidGlyph from "@/components/shaders/fluid-glyph";
import { Button } from "@/components/ui/button";
import CornerBoxes from "./corner-boxes";

export default function HeroSection() {
  return (
    <section className="relative w-full border-b">
      <div className="grid grid-cols-2 w-full">
        <div className="flex flex-col items-start justify-center gap-8 p-12 border-b border-r">
          <h1 className="text-7xl font-medium">
            Clinically Guided, Grounded in Care
          </h1>
          <p className="text-xl text-muted-foreground">
            Reflect and reset in a private, supportive space with professionals
            using tools to deepen therapy
          </p>
          <div className="flex gap-4">
            <Button variant="default" size="xl" asChild>
              <Link href="/about">
                Get Started
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/about">
                Learn More
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="border-b aspect-[1.25]">
          <FluidGlyph />
        </div>
        <div className="flex items-center text-2xl p-12 border-r">
          You're in a private and safe space.
        </div>
        <div className="flex items-center justify-center gap-12 text-sm p-12">
          <p className="flex items-center gap-2 py-2 px-4 rounded-full bg-muted/50 border">
            <Users className="w-4 h-4" />
            <span>Qualified Therapists</span>
          </p>
          <p className="flex items-center gap-2 py-2 px-4 rounded-full bg-muted/50 border">
            <Shield className="w-4 h-4" />
            <span>100% Confidential</span>
          </p>
          <p className="flex items-center gap-2 py-2 px-4 rounded-full bg-muted/50 border">
            <Clock className="w-4 h-4" />
            <span>Stop Anytime</span>
          </p>
        </div>
      </div>
      <CornerBoxes />
    </section>
  );
}
