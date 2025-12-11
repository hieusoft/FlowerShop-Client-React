"use client";

import { useState } from "react";
import ProgressSteps from "@/components/blocks/checkout/ProgressSteps";
import CheckoutForm from "@/components/blocks/checkout/CheckoutForm";
import OrderSummary from "@/components/blocks/checkout/OrderSummary";

import { CheckoutFormData } from "../../../models/checkout";
import SuccessMessage from "@/components/blocks/checkout/SuccessMessage";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    province: "",
    ward: "",
    note: "",
    shippingMethod: "standard",
    paymentMethod: "cod",
    useShippingAddress: true,
    saveInfo: true,
    acceptTerms: false,
    isNew: false,
    giftMessage: "",
  });

  const shippingFee = formData.shippingMethod === "express" ? 50000 : 30000;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyCoupon = () => {
    if (!couponCode) {
      setCouponError("Vui lòng nhập mã giảm giá");
      return;
    }

    if (couponCode.toUpperCase() === "SALE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Mã giảm giá không hợp lệ");
      setCouponApplied(false);
    }
  };

  const handleNextStep = () => {
    
    if (
      step === 1 &&
      ( !formData.phone || !formData.fullName || !formData.isNew)
    ) {
      alert("Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }
    if (
      step === 2 &&
      (!formData.address || !formData.province )
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!formData.acceptTerms) {
      alert("Vui lòng đồng ý với điều khoản và điều kiện");
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

        {/* Right Column - Order Summary */}
        <div>
          <OrderSummary
            cartItems={[]}
            shippingFee={shippingFee}
            couponCode={couponCode}
            couponApplied={couponApplied}
            couponError={couponError}
            onCouponCodeChange={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
          />
        </div>
      </div>
    </div>
  );
}
