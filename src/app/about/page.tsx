import Navbar from "@/components/blocks/navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <ScrollArea className="h-screen w-screen px-16">
      <div className="min-h-screen bg-background flex flex-col font-sans border-l border-r">
        {/* Remove the Navbar if it is already included in your layout.tsx */}
        <Navbar />

        <main className="flex-grow pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center space-y-6 py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-700">
                Avika
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize mental health through
              innovative technology and evidence-based therapeutic approaches.
            </p>
          </section>

          {/* Origin Story */}
          <section className="bg-muted/30 py-16 md:py-24 border-y border-border/50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
              <div className="mb-12 md:mb-16 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Origin Story
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  The journey of avika began with a shared vision to bridge the
                  gap between traditional therapy and modern technology.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Using standard <img> tags to avoid Next.js domain config errors for external URLs */}
                <div className="rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-xl border border-border/50 hover:scale-[1.05] duration-300">
                  <Image
                    src="https://avika.ai/images/founders/story-1.png"
                    alt="Avika Origin Story Part 1"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-xl border border-border/50 hover:scale-[1.05] duration-300">
                  <Image
                    src="https://avika.ai/images/founders/story-2.png"
                    alt="Avika Origin Story Part 2"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Who We Are */}
          <section className="py-16 md:py-24 container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Who We Are
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are a passionate team of therapists, technologists, and
                wellness advocates united by a common goal &mdash; to make
                mental health support more effective, accessible, and human.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              <ValueCard
                title="Innovation"
                description="We leverage cutting-edge VR technology and AI to create immersive therapeutic experiences that transcend traditional methods."
              />
              <ValueCard
                title="Accessibility"
                description="We believe quality mental health support should be available to everyone, everywhere — breaking barriers of geography and stigma."
              />
              <ValueCard
                title="Evidence-Based"
                description="Every approach we use is grounded in clinical research and validated therapeutic frameworks, ensuring effective outcomes."
              />
              <ValueCard
                title="Empathy"
                description="We approach wellness with compassion — understanding that every individual's journey to well-being is unique and deserving of respect."
              />
            </div>
          </section>

          {/* Meet The Team */}
          <section className="bg-muted/30 py-16 md:py-24 border-t border-border/50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
                Meet The Team
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {TEAM_MEMBERS.map((member) => (
                  <TeamMemberCard key={member.name} {...member} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </ScrollArea>
  );
}

// --- Helper Components ---

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden transition-all shadow-none hover:shadow-lg hover:scale-[1.02] duration-300">
      <CardHeader title={title} description={description}></CardHeader>
    </Card>
  );
}

function TeamMemberCard({
  image,
  name,
  role,
  description,
  link,
}: {
  image: string;
  name: string;
  role: string;
  description: string;
  link?: string;
}) {
  // Simple helper to generate initials for the avatar placeholder
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <Card className="overflow-hidden transition-all shadow-none hover:shadow-xl hover:scale-[1.05] duration-300">
      <CardMedia
        variant="icon"
        className="h-24 py-4 flex items-center justify-center text-primary"
      >
        <Avatar className="size-24">
          <AvatarImage src={image} alt={`${name}'s profile picture`} />
          <AvatarFallback className="text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </CardMedia>
      <CardHeader className="flex-1">
        <CardTitle className="text-center">{name}</CardTitle>
        <CardDescription>
          <p className="w-full text-center text-sm font-medium text-muted-foreground">
            {role}
          </p>
          <p className="text-sm text-justify text-muted-foreground leading-relaxed mt-4">
            {description}
          </p>
        </CardDescription>
      </CardHeader>
      {link && (
        <CardFooter className="flex justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              LinkedIn
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// --- Data ---

const TEAM_MEMBERS = [
  {
    image: "https://avika.ai/images/founders/sirisha.png",
    name: "Sirisha Peyyeti",
    role: "CEO",
    description:
      "Expert in building digital platforms with over 20 years in IT. Known for customer-centric approaches and problem-solving skills. A track record of driving digital transformation, leveraging strategy to realize customers' goals effectively.",
    link: "#", // Add actual LinkedIn URLs here
  },
  {
    image: "https://avika.ai/images/founders/vishal.png",
    name: "Dr Vishal Indla",
    role: "Medical Director",
    description:
      "MD in Psychiatry, NIMHANS, Director of INDLAS Hospitals and Indlas Child Guidance Clinics. A renowned author/speaker and poster boy of our clinical team. Our solutions are deeply rooted in real-world medical expertise.",
    link: "#",
  },
  {
    image: "https://avika.ai/images/founders/atreya.png",
    name: "Srinivas Atreya",
    role: "CTO",
    description:
      "A seasoned professional with over 25 years in Data & Analytics, Technology and Leadership with rich experience in driving digital transformation. Recognized as a Top 100 AI leader. Passionate about AI/ML solving complex business problems.",
    link: "#",
  },
  {
    image: "https://avika.ai/images/founders/pingali.png",
    name: "Dr Srinivas Pingali",
    role: "Strategic Advisor",
    description:
      "Professor at a leading business school in Dubai. Played a pivotal role across startups and leading companies in the BPM industry. Proven track record in sales, marketing, and business unit driving growth and innovation.",
    link: "#",
  },
];
