"use client";

import { useState } from "react";
import ProgressSteps from "@/components/blocks/checkout/ProgressSteps";
import CheckoutForm from "@/components/blocks/checkout/CheckoutForm";
import OrderSummary from "@/components/blocks/checkout/OrderSummary";

import { CheckoutFormData } from "../../../models/checkout";
import SuccessMessage from "@/components/blocks/checkout/SuccessMessage";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    province: "",
    ward: "",
    note: "",
    paymentMethod: "cod",
    saveInfo: true,
    acceptTerms: false,
    isNew: false,
    giftMessage: "",
    deliveryDate: "",
    deliveryTime: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyCoupon = () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (couponCode.toUpperCase() === "SALE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code.");
      setCouponApplied(false);
    }
  };

  const handleNextStep = () => {
    if (
      step === 1 &&
      (!formData.phone || !formData.fullName || !formData.isNew)
    ) {
      showAlert("Please complete your contact information.");
      return;
    }

    if (
      step === 2 &&
      (!formData.address ||
        !formData.province ||
        !formData.ward ||
        !formData.deliveryDate ||
        !formData.deliveryTime)
    ) {
      showAlert("Please complete your shipping address.");
      return;
    }

    if (step === 3 && !formData.giftMessage) {
      showAlert("Please enter a gift message.");
      return;
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    
    if (!formData.acceptTerms) {
      showAlert("Please accept the terms and conditions.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newOrderNumber = `ORD-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      setOrderNumber(newOrderNumber);
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  if (orderComplete) {
    return <SuccessMessage orderNumber={orderNumber} formData={formData} />;
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <ProgressSteps step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            step={step}
            formData={formData}
            isProcessing={isProcessing}
            onInputChange={handleInputChange}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>

        <div>
          <OrderSummary
            cartItems={[]}
            couponCode={couponCode}
            couponApplied={couponApplied}
            couponError={couponError}
            onCouponCodeChange={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
          />
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
