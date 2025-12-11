"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import ContactInfoStep from "./ContactInfoStep";
import ShippingAddressStep from "./ShippingAddressStep";
import GiftMessageStep from "./GiftMessageStep";
import PaymentStep from "./PaymentStep";

import { CheckoutFormData } from "../../../models/checkout";

interface CheckoutFormProps {
  step: number;
  formData: CheckoutFormData;
  isProcessing: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onPlaceOrder: () => void;
}

export default function CheckoutForm({
  step,
  formData,
  isProcessing,
  onInputChange,
  onNextStep,
  onPrevStep,
  onPlaceOrder,
}: CheckoutFormProps) {
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    onInputChange(field, value);
  };

  return (
    <div className="space-y-6">

      {step === 1 && (
        <ContactInfoStep formData={formData} onInputChange={handleInputChange} />
      )}

      {step === 2 && (
        <ShippingAddressStep formData={formData} onInputChange={handleInputChange} />
      )}

      {step === 3 && (
        <GiftMessageStep formData={formData} onInputChange={handleInputChange} />
      )}

      {step === 4 && (
        <PaymentStep
          formData={formData}
          onInputChange={handleInputChange}
          isProcessing={isProcessing}
          onPlaceOrder={onPlaceOrder}
          onPrevStep={onPrevStep}
        />
      )}

      {step < 4 && (
        <div className="flex justify-between">
      
          {step > 1 ? (
            <Button variant="outline" onClick={onPrevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          )}

     
          <Button onClick={onNextStep}>
            Continue
          </Button>
        </div>
      )}

     
    </div>
  );
}
