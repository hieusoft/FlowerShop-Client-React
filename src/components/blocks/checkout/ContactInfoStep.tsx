"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ChevronDown, X } from "lucide-react";
import AuthService from "@/lib/AuthService";
import { useState, useEffect } from "react";
import { on } from "events";

interface Recipient {
  recipientId: number;
  userId: number;
  fullName: string;
  addressLine: string;
  city: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface ContactInfoStepProps {
  formData: {
    phone: string;
    fullName: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export default function ContactInfoStep({ formData, onInputChange }: ContactInfoStepProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [useManualInput, setUseManualInput] = useState(false);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        setIsLoading(true);
        const data = await AuthService.GetReipientUser();
        setRecipients(data.data);

        const defaultRecipient = data.data.find((recipient: Recipient) => recipient.isDefault);
        if (defaultRecipient) {
          setSelectedRecipientId(defaultRecipient.recipientId);
          updateFormData(defaultRecipient);
        } else if (data.data.length > 0) {
          setSelectedRecipientId(data.data[0].recipientId);
          updateFormData(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch recipients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipients();
  }, []);

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipientId(recipient.recipientId);
    setUseManualInput(false);
    updateFormData(recipient);
    setShowDropdown(false);
    onInputChange("isNew", "false");

  };

  const handleUseManualInput = () => {
    setUseManualInput(true);
    setSelectedRecipientId(null);

    onInputChange("fullName", "");
    onInputChange("phone", "");
    onInputChange("isNew", "true");
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    handleUseManualInput();
  };

  const updateFormData = (recipient: Recipient) => {
    onInputChange("fullName", recipient.fullName);
    onInputChange("phone", recipient.phoneNumber);
    onInputChange("isNew", "false");
    onInputChange("address", recipient.addressLine);
    onInputChange("province", recipient.city);
    };

  const selectedRecipient = recipients.find(r => r.recipientId === selectedRecipientId);

  const getDropdownDisplayText = () => {
    if (useManualInput) return "Enter manually";
    if (selectedRecipient) return selectedRecipient.fullName;
    return "Select recipient";
  };

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

      <CardContent className="space-y-6">
        {/* Recipient Dropdown */}
        {!isLoading && recipients.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Recipient</Label>
              {selectedRecipientId && !useManualInput && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Enter manually
                </button>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-between w-full p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{getDropdownDisplayText()}</span>

                  {selectedRecipient?.isDefault && !useManualInput && (
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
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Manual Input Option */}
                  <button
                    type="button"
                    onClick={handleUseManualInput}
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
              )}
            </div>
          </div>
        )}

        {/* Contact Form (No email) */}
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
              disabled={selectedRecipient && !useManualInput}
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
              disabled={selectedRecipient && !useManualInput}
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-4 text-gray-500">Loading recipients...</div>
        )}

        {/* No recipients */}
        {!isLoading && recipients.length === 0 && (
          <div className="text-center py-4 text-gray-500 border rounded-md bg-gray-50">
            You have no saved recipients. Please enter manually.
          </div>
        )}

        {/* Manual input info */}
        {useManualInput && (
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Manual Input Mode:</strong> You are entering a new recipient.  
              This information will NOT be saved to your recipient list.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
