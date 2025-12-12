"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, ChevronDown, X } from "lucide-react";
import RecipientService from "@/lib/api/RecipientService";
import { useState, useEffect } from "react";

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
  formData: { phone: string; fullName: string };
  onInputChange: (field: string, value: string) => void;
}

export default function ContactInfoStep({ formData, onInputChange }: ContactInfoStepProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useManualInput, setUseManualInput] = useState(false);

  // Fetch recipients
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        setIsLoading(true);
        const response = await RecipientService.fromUser();
        const data = response.data || [];

        setRecipients(data);

        const defaultRecipient = data.find((r: Recipient) => r.isDefault);
        const firstRecipient = data[0];

        const selected = defaultRecipient || firstRecipient;

        if (selected) {
          setSelectedRecipientId(selected.recipientId);
          fillFormWithRecipient(selected);
        }
      } catch (error) {
        console.error("Failed to fetch recipients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipients();
  }, []);

  // Helper to fill form
  const fillFormWithRecipient = (recipient: Recipient) => {
    onInputChange("fullName", recipient.fullName);
    onInputChange("phone", recipient.phoneNumber);
    onInputChange("address", recipient.addressLine);
    onInputChange("province", recipient.province);
    onInputChange("ward", recipient.ward);
    onInputChange("isNew", "false");
  };

  const clearToManualInput = () => {
    setUseManualInput(true);
    setSelectedRecipientId(null);
    onInputChange("fullName", "");
    onInputChange("phone", "");
    onInputChange("isNew", "true");
  };

  const handleRecipientSelect = (recipient: Recipient) => {
    setUseManualInput(false);
    setSelectedRecipientId(recipient.recipientId);
    fillFormWithRecipient(recipient);
  };

  const selectedRecipient = recipients.find((r) => r.recipientId === selectedRecipientId);

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

        {/* Recipient Dropdown */}
        {!isLoading && recipients.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Recipient</Label>

              {selectedRecipientId && !useManualInput && (
                <button
                  type="button"
                  onClick={clearToManualInput}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Enter manually
                </button>
              )}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{triggerText}</span>

                    {!useManualInput && selectedRecipient?.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}

                    {useManualInput && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Manual Input
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </PopoverTrigger>

              {/* FULL WIDTH FIX */}
              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-[var(--radix-popper-anchor-width)] p-0"
              >
                <div className="max-h-60 overflow-auto">

                  {/* Manual Mode Option */}
                  <button
                    type="button"
                    onClick={clearToManualInput}
                    className={`flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 ${
                      useManualInput ? "bg-blue-50" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">Enter Manually</div>
                      <div className="text-sm text-gray-500">Create a new recipient</div>
                    </div>

                    {useManualInput && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Selected
                      </span>
                    )}
                  </button>

                  <div className="border-t my-1"></div>

                  {/* Recipient List */}
                  {recipients.map((recipient) => (
                    <button
                      key={recipient.recipientId}
                      onClick={() => handleRecipientSelect(recipient)}
                      type="button"
                      className={`flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 ${
                        selectedRecipientId === recipient.recipientId ? "bg-blue-50" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium">{recipient.fullName}</div>
                        <div className="text-sm text-gray-500">{recipient.phoneNumber}</div>
                        {recipient.addressLine && (
                          <div className="text-xs text-gray-400">{recipient.addressLine}</div>
                        )}
                      </div>

                      {recipient.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Contact Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0912 345 678"
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              required
              disabled={selectedRecipientId && !useManualInput}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => onInputChange("fullName", e.target.value)}
              required
              disabled={selectedRecipientId && !useManualInput}
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-4 text-gray-500">Loading recipients...</div>
        )}

        {/* Empty List */}
        {!isLoading && recipients.length === 0 && (
          <div className="text-center py-4 text-gray-500 border rounded-md bg-gray-50">
            You have no saved recipients. Please enter manually.
          </div>
        )}

        {/* Manual Mode Info */}
        {useManualInput && (
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Manual Input Mode:</strong> You are entering a new recipient.
              This information will NOT be saved to your list.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
