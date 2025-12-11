"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface GiftMessageStepProps {
  formData: { giftMessage: string };
  onInputChange: (field: string, value: string) => void;
}

export default function GiftMessageStep({ formData, onInputChange }: GiftMessageStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Message</CardTitle>
        <CardDescription>Write a message to include with your order (optional)</CardDescription>
      </CardHeader>

      <CardContent>
        <Textarea
          placeholder="Your message to the recipient…"
          value={formData.giftMessage}
          onChange={(e) => onInputChange("giftMessage", e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
