"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface ShippingAddressStepProps {
  formData: {
    address: string;
    province: string;
    ward: string;
    note: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const provinces = [
  "Hanoi",
  "Ho Chi Minh City",
  "Da Nang",
  "Hai Phong",
  "Can Tho",
  "Binh Duong",
  "Dong Nai",
  "Khanh Hoa",
];

export default function ShippingAddressStep({
  formData,
  onInputChange,
}: ShippingAddressStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
        <CardDescription>
          Please enter your shipping address information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            placeholder="House number, street name, ward..."
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            required
          />
        </div>

        {/* Province */}
        <div className="space-y-2">
          <Label htmlFor="province">Province / City *</Label>
          <Select
            value={formData.province}
            onValueChange={(value) => onInputChange("province", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ward */}
        <div className="space-y-2">
          <Label htmlFor="ward">Ward</Label>
          <Input
            id="ward"
            placeholder="Enter ward"
            value={formData.ward}
            onChange={(e) => onInputChange("ward", e.target.value)}
          />
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor="note">Delivery Note</Label>
          <Textarea
            id="note"
            placeholder="Special instructions for delivery..."
            value={formData.note}
            onChange={(e) => onInputChange("note", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
