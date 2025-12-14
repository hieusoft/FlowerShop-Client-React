"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useState, useEffect } from "react";

interface ShippingAddressStepProps {
  formData: {
    address: string;
    province: string;
    ward: string;
    note: string;
    deliveryDate: string;
    deliveryTime: string;
    isNew?: boolean;            // ⬅ sửa thành boolean
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export default function ShippingAddressStep({
  formData,
  onInputChange,
}: ShippingAddressStepProps) {
  const [date, setDate] = useState<Date | undefined>(
    formData.deliveryDate ? new Date(formData.deliveryDate) : undefined
  );

  const [provinces, setProvinces] = useState<any[]>([]);
  const [loadingProvince, setLoadingProvince] = useState(true);

  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [wards, setWards] = useState<any[]>([]);

  const isDisable = formData.isNew === false;

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvince(true);
      const res = await fetch("https://provinces.open-api.vn/api/v2/p");
      const data = await res.json();
      setProvinces(data || []);
      setLoadingProvince(false);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (formData.isNew) return;  
    if (!formData.province) return;

    const selected = provinces.find((p) => p.name === formData.province);
    if (selected) setProvinceCode(selected.code);
  }, [provinces]);

  useEffect(() => {
    if (!provinceCode) return;

    const fetchWards = async () => {
      const res = await fetch(
        `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`
      );
      const data = await res.json();
      setWards(data.wards || []);
    };
    fetchWards();
  }, [provinceCode]);

  useEffect(() => {
    if (formData.isNew) return;
    if (!formData.ward) return;

    const exist = wards.find((w) => w.name === formData.ward);
    if (exist) onInputChange("ward", exist.name);
  }, [wards]);

  const times = Array.from({ length: 13 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleProvinceChange = (value: string, code: number) => {
    onInputChange("province", value);
    onInputChange("ward", "");
    setProvinceCode(code);
  };

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
        <div className="space-y-2">
          <Label>Address *</Label>
          <Textarea
            placeholder="House number, street name, ward..."
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            required
            disabled={isDisable}
          />
        </div>

        <div className="space-y-2">
          <Label>Province / City *</Label>
          <Select
            value={formData.province}
            onValueChange={(value) => {
              const selected = provinces.find((p) => p.name === value);
              handleProvinceChange(selected.name, selected.code);
            }}
            disabled={isDisable}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={loadingProvince ? "Loading..." : "Select province"}
              />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.code} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ward *</Label>
          <Select
            value={formData.ward}
            onValueChange={(value) => onInputChange("ward", value)}
            disabled={isDisable}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.code} value={w.name}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        <div className="space-y-2">
          <Label>Delivery Note</Label>
          <Textarea
            placeholder="Special instructions for delivery..."
            value={formData.note}
            onChange={(e) => onInputChange("note", e.target.value)}
            
          />
        </div>
      </CardContent>
    </Card>
  );
}
