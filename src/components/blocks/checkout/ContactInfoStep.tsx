"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, ChevronDown, X } from "lucide-react";
import RecipientService from "@/lib/api/RecipientService";

interface Recipient {
  recipientId: number;
  userId: number;
  fullName: string;
  addressLine: string;
  province: string;
  ward: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface ContactInfoStepProps {
  formData: {
    phone: string;
    fullName: string;
  };
  onInputChange: (field: string, value: string | boolean | number) => void;
}

export default function ContactInfoStep({ formData, onInputChange }: ContactInfoStepProps) {
  const [open, setOpen] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
  const [useManualInput, setUseManualInput] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await RecipientService.fromUser();
        const data: Recipient[] = res.data || [];
        setRecipients(data);

        if (data.length === 0) {
          setUseManualInput(true);
          onInputChange("isNew", true);
          return;
        }

        const selected = data.find(r => r.isDefault) || data[0];
        selectRecipient(selected);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectRecipient = (recipient: Recipient) => {
    setUseManualInput(false);
    setSelectedRecipientId(recipient.recipientId);
    onInputChange("fullName", recipient.fullName);
    onInputChange("phone", recipient.phoneNumber);
    onInputChange("address", recipient.addressLine);
    onInputChange("province", recipient.province);
    onInputChange("ward", recipient.ward);
    onInputChange("isNew", false);
  };

  const switchToManual = () => {
    setUseManualInput(true);
    setSelectedRecipientId(null);
    onInputChange("fullName", "");
    onInputChange("phone", "");
    onInputChange("address", "");
    onInputChange("province", "");
    onInputChange("ward", "");
    onInputChange("isNew", true);
  };

  const selectedRecipient = recipients.find(r => r.recipientId === selectedRecipientId);

  const triggerText = useManualInput
    ? "Enter manually"
    : selectedRecipient
    ? selectedRecipient.fullName
    : "Select recipient";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Provide information so we can contact you
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 overflow-visible">
        {!loading && recipients.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Recipient</Label>
              {!useManualInput && selectedRecipientId && (
                <button
                  type="button"
                  onClick={switchToManual}
                  className="text-sm text-blue-600 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Enter manually
                </button>
              )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{triggerText}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-[var(--radix-popper-anchor-width)] p-0"
              >
                <div className="max-h-60 overflow-auto">
                  <button
                    type="button"
                    onClick={() => {
                      switchToManual();
                      setOpen(false);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-50"
                  >
                    <div className="font-medium">Enter manually</div>
                    <div className="text-sm text-gray-500">Create new recipient</div>
                  </button>

                  <div className="border-t my-1" />

                  {recipients.map(r => (
                    <button
                      key={r.recipientId}
                      type="button"
                      onClick={() => {
                        selectRecipient(r);
                        setOpen(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 ${
                        selectedRecipientId === r.recipientId ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="font-medium">{r.fullName}</div>
                      <div className="text-sm text-gray-500">{r.phoneNumber}</div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e => onInputChange("phone", e.target.value)}
              disabled={!!selectedRecipientId && !useManualInput}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={e => onInputChange("fullName", e.target.value)}
              disabled={!!selectedRecipientId && !useManualInput}
              required
            />
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500">Loading recipients...</div>
        )}

        {!loading && recipients.length === 0 && (
          <div className="text-center text-gray-500 border rounded-md p-4">
            No saved recipients. Please enter manually.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

