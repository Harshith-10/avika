import {
  ArrowRight,
  Frown,
  Heart,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardMedia } from "../ui/card";
import CornerBoxes from "./corner-boxes";

export default function CTASection() {
  return (
    <section className="relative w-full border-b">
      <div className="grid grid-cols-2 w-full">
        <div className="flex flex-col items-start justify-center p-18 border-r">
          <Image
            src="https://avika.ai/assets/struggling-illustration-C_ENTxCZ.svg"
            alt="CTA Image"
            width={600}
            height={400}
            className="w-full h-auto object-cover brightness-0 dark:invert"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-8 p-18">
          <h2 className="text-4xl font-medium">
            What you may already be struggling with
          </h2>
          <div className="w-full grid grid-cols-2 gap-4">
            <CTACard
              icon={<Heart className="size-12" />}
              title="Constantly worried"
              description="You often overthink small things, feel tense for no clear reason, and find it hard to relax, even when nothing is wrong."
              gradient="bg-gradient-to-tr from-pink-500/50 to-purple-500/20"
            />
            <CTACard
              icon={<MessageCircle className="size-12" />}
              title="Reliving difficult experiences"
              description="You feel triggered by old memories, get sudden fear or panic, or avoid places, people, or situations that remind you of something painful."
              gradient="bg-gradient-to-tr from-blue-500/50 to-cyan-500/20"
            />
            <CTACard
              icon={<HelpCircle className="size-12" />}
              title="Self Doubt"
              description="Going through constant self-questioning, fear of making mistakes, or feeling “not good enough.”"
              gradient="bg-gradient-to-tr from-green-500/50 to-teal-500/20"
            />
            <CTACard
              icon={<Frown className="size-12" />}
              title="Depression"
              description="Going through Persistent sadness, Loss of interest or pleasure in activities, fatigue or lack of energy."
              gradient="bg-gradient-to-tr from-red-500/50 to-orange-500/20"
            />
          </div>
          <Button variant="outline" size="xl" className="w-full">
            Get Help Now
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
      <CornerBoxes />
    </section>
  );
}

function CTACard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardMedia
        variant="image"
        className={`py-8 flex items-center justify-center text-primary ${gradient}`}
      >
        {icon}
      </CardMedia>
      <CardHeader title={title} description={description} />
    </Card>
  );
}
