import { Sunrise } from "lucide-react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-16 font-sans">
      <div className="max-w-7xl mx-auto bg-muted p-12 rounded-3xl border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
          {/* Brand */}
          <div className="flex flex-col items-start lg:col-span-1">
            <div className="flex items-center gap-5">
              <div className="bg-white text-black p-2 rounded-full h-[52px] w-[52px] flex items-center justify-center shrink-0">
                <Sunrise className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-[22px] font-medium leading-tight tracking-wide">
                  Ah-vee-kah
                </h2>
                <h3 className="text-[18px] text-muted-foreground leading-tight tracking-wide">
                  (अ-विका)
                </h3>
              </div>
            </div>
            <div className="mt-6 text-muted-foreground leading-snug">
              A ray of light, symbolising grounding, growth, and illumination in
              mental health therapy
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-6 lg:pl-12">
            <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
              Our Offerings
            </h3>
            <nav className="flex flex-col gap-3 text-[22px]">
              <Link
                href="#"
                className="hover:text-muted-foreground transition-colors"
              >
                For Individuals
              </Link>
              <Link
                href="#"
                className="hover:text-muted-foreground transition-colors"
              >
                For Corporates
              </Link>
              <Link
                href="#"
                className="hover:text-muted-foreground transition-colors"
              >
                For Hospitals
              </Link>
            </nav>
          </div>

          {/* Useful Links */}
          <div className="flex flex-col gap-6 lg:pl-12">
            <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
              Useful Links
            </h3>
            <nav className="flex flex-col gap-3 text-[22px]">
              <Link
                href="#"
                className="hover:text-muted-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="hover:text-muted-foreground transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="#"
                className="hover:text-muted-foreground transition-colors"
              >
                Know More
              </Link>
            </nav>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
              Socials
            </h3>
            <div className="flex gap-5">
              <Link
                href="#"
                aria-label="Social 1"
                className="hover:text-muted-foreground transition-colors"
              >
                <FaLinkedinIn className="h-[22px] w-[22px]" />
              </Link>
              <Link
                href="#"
                aria-label="Social 2"
                className="hover:text-muted-foreground transition-colors"
              >
                <FaInstagram className="h-[22px] w-[22px]" />
              </Link>
              <Link
                href="#"
                aria-label="Social 3"
                className="hover:text-muted-foreground transition-colors"
              >
                <FaFacebook className="h-[22px] w-[22px]" />
              </Link>
              <Link
                href="#"
                aria-label="Social 4"
                className="hover:text-muted-foreground transition-colors"
              >
                <FaYoutube className="h-[22px] w-[22px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-0 pt-4">
          {/* Copyright & Links */}
          <div className="flex flex-col gap-4 text-[15px] text-muted-foreground">
            <p>© 2026 • Avika Mind Health • All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-auto min-w-[380px]">
            <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-5">
              Get Updates
            </h3>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="E-MAIL"
                className="w-full bg-black border text-white rounded-full py-3.5 pl-6 pr-40 focus:outline-none focus:border-zinc-500 transition-colors text-sm tracking-[0.15em] placeholder:text-zinc-600"
              />
              <Button className="absolute py-4.5 right-1.5 top-1.5 bottom-1.5 bg-white text-black px-6 rounded-full text-[11px] font-bold tracking-[0.15em] hover:bg-zinc-200 transition-colors">
                GET UPDATES
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
