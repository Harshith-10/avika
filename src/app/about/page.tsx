import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">This is the About Page</h1>
      <Button variant="outline" size="lg" asChild>
        <Link href="/">
          <ArrowLeft />
          Back to Landing Page
        </Link>
      </Button>
    </main>
  );
}
