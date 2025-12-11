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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface ShippingAddressStepProps {
  formData: {
    address: string;
    province: string;
    ward: string;
    note: string;
    deliveryDate: string;
    deliveryTime: string;
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
  const [date, setDate] = useState<Date | undefined>(
    formData.deliveryDate ? new Date(formData.deliveryDate) : undefined
  );

  const times = Array.from({ length: 13 }, (_, i) => {
    const hour = 9 + i; // 9 → 21
    return `${hour.toString().padStart(2, "0")}:00`;
  });

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

        {/* Date Picker */}
        <div className="space-y-2">
          <Label>Delivery Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="w-full flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
              >
                {date ? format(date, "dd/MM/yyyy") : "Select delivery date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => {
                  setDate(day!);
                  onInputChange("deliveryDate", day!.toISOString());
                }}
                disabled={(day) => day < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <Label>Delivery Time *</Label>
          <Select
            value={formData.deliveryTime}
            onValueChange={(value) => onInputChange("deliveryTime", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery time" />
            </SelectTrigger>
            <SelectContent>
              {times.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
