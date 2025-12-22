"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Signature } from "../../ui/signature";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Separator } from "../../ui/separator";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
  SiTiktok,
} from "@icons-pack/react-simple-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

const footerSocials = [
  {
    name: "Facebook",
    icon: SiFacebook,
    link: "https://facebook.com/javaflorist",
  },
  {
    name: "Instagram",
    icon: SiInstagram,
    link: "https://instagram.com/javaflorist",
  },
  {
    name: "X (Twitter)",
    icon: SiX,
    link: "https://x.com/javaflorist",
  },
  {
    name: "YouTube",
    icon: SiYoutube,
    link: "https://youtube.com/@javaflorist",
  },
  {
    name: "TikTok",
    icon: SiTiktok,
    link: "https://tiktok.com/@javaflorist",
  },
];

export function Footer() {
  return (
    <footer className="bg-background text-foreground mt-auto border-t border-border">
      <div className="container mx-auto flex flex-col px-8 py-8 gap-8 text-sm">
        <div className="flex gap-8 md:gap-12 flex-col md:flex-row">
          <section className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5 shrink-0">
            <Link href="/">
              <h2>
                <Signature />
              </h2>
            </Link>

            <Separator className="my-4" />

            <address className="flex flex-col gap-2 italic">
              <span className="flex items-center gap-2">
                <MapPinIcon className="size-5" />
                Andheri West, Mumbai, Maharashtra, India
              </span>

              <span className="flex items-center gap-2">
                <PhoneIcon className="size-5" />
                <a href="tel:+912245678900">+91 22 4567 8900</a>
              </span>

              <span className="flex items-center gap-2">
                <MailIcon className="size-5" />
                <a href="mailto:support@javaflorist.in">
                  support@javaflorist.in
                </a>
              </span>

              <Separator className="my-3" />

              <span className="flex gap-4">
                {footerSocials.map((social, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <a href={social.link} target="_blank">
                        <social.icon className="size-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{social.name}</TooltipContent>
                  </Tooltip>
                ))}
              </span>
            </address>
          </section>

          <section className="flex flex-wrap gap-8 grow">
            <div className="flex flex-col gap-2 basis-48">
              <h4 className="font-heading text-xl">Shop</h4>
              <Link href="/shop">All Bouquets</Link>
              <Link href="/shop/birthday">Birthday Flowers</Link>
              <Link href="/shop/wedding">Wedding Flowers</Link>
              <Link href="/shop/anniversary">Anniversary Flowers</Link>
              <Link href="/shop/new-baby">New Baby Flowers</Link>
              <Link href="/shop/thank-you">Thank You Flowers</Link>
              <Link href="/shop/same-day-delivery">
                Same Day Delivery
              </Link>
            </div>

            <div className="flex flex-col gap-2 basis-48">
              <h4 className="font-heading text-xl">About Us</h4>
              <Link href="/about-us">Our Story</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact</Link>
            </div>

            <div className="flex flex-col gap-2 basis-48">
              <h4 className="font-heading text-xl">Legal</h4>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/refund-policy">Refund Policy</Link>
            </div>
          </section>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="text-muted-foreground">
            © 2025 Java Florist. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
