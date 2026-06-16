import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardFooter, CardHeader, CardMedia } from "../ui/card";
import CornerBoxes from "./corner-boxes";

export default function OffersSection() {
  return (
    <section className="relative w-full border-b">
      <div className="p-12 flex flex-col items-start justify-center gap-8">
        <h2 className="text-4xl font-medium">What We Offer</h2>
        <div className="grid grid-cols-3 w-full gap-8">
          <OfferCard
            title="Your Healing Journey: First Session at 20% Off"
            description="Experience a safe, supportive space with expert psychologists."
            imageUrl="https://avika.ai/assets/healing-journey-Dad6h7Eu.png"
          />
          <OfferCard
            title="Therapist + Psychiatrist Together: One Seamless Session"
            description="Just one unified care team supporting you."
            imageUrl="https://avika.ai/assets/therapist-9iX9Qbq4.png"
          />
          <OfferCard
            title="Affordable Therapy Packs: Save up to ₹1000"
            description="Designed for Progress. Get 5 sessions at a discounted rate."
            imageUrl="https://avika.ai/assets/affordable-therapy-5f5WvCak.png"
          />
        </div>
        <div className="flex w-full items-center justify-end">
          <Button variant="outline">
            View All Offers
            <ArrowRight />
          </Button>
        </div>
      </div>
      <CornerBoxes />
    </section>
  );
}

function OfferCard({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardMedia className="h-48 bg-muted" variant="image">
        <Image src={imageUrl} alt="Image" width={600} height={400} />
      </CardMedia>
      <CardHeader
        description={description}
        title={title}
        className="flex-1 flex flex-col justify-start"
      />

      <CardFooter className="flex-row-reverse gap-4">
        <Button className="flex-1">Buy now</Button>
        <Button className="flex-1" variant="outline">
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
