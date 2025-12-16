"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactUsPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent 🌸");
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900">
          Contact Java Florist
        </h1>
        <p className="text-neutral-600 mt-3">
          We’d love to help you deliver your wishes with flowers
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Our Store</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-neutral-700">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span>Somewhere, Mumbai, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-pink-500" />
              <span>+91 222 222222</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-pink-500" />
              <span>hello@javaflorist.example.com</span>
            </div>

            <p className="pt-4">
              Working hours: <br />
              <b>9:00 AM – 9:00 PM</b>
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input placeholder="Full name" required />
              <Input placeholder="Email address" type="email" required />
              <Input placeholder="Phone number" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="thankyou">Thank You</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Your message"
                rows={4}
              />

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
