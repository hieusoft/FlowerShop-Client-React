"use client";

import { useState } from "react";
import ProgressSteps from "@/components/blocks/checkout/ProgressSteps";
import CheckoutForm from "@/components/blocks/checkout/CheckoutForm";
import OrderSummary from "@/components/blocks/checkout/OrderSummary";
import { CheckoutFormData } from "../../../models/checkout";
import SuccessMessage from "@/components/blocks/checkout/SuccessMessage";
import RecipientService from "@/lib/api/RecipientService";
import OrderService from "@/lib/api/OrderService";
import PaymentService from "@/lib/api/PaymentService";
import PaymentProcessing from "@/components/blocks/checkout/PaymentProcessing";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecipientCreateDTO {
  fullName: string;
  addressLine: string;
  province: string;
  ward: string;
  phoneNumber: string;
}

type PaymentStatus = "idle" | "processing" | "success" | "failed";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [orderNumber, setOrderNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [formData, setFormData] = useState<CheckoutFormData>({
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
    tax: 0,
    fee: 0,
    cartItems: [],
    couponCode: null,
  });

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

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
    if (step === 1 && (!formData.phone || !formData.fullName)) {
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
  const removeOrderedItemsFromCart = (orderedItems: any[]) => {
    const rawCart = localStorage.getItem("cart");
    if (!rawCart) return;

    const cart = JSON.parse(rawCart);

    const orderedIds = orderedItems.map(item => item.id);

    const newCart = cart.filter(
      (item: any) => !orderedIds.includes(item.id)
    );

    if (newCart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      localStorage.removeItem("cart");
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.acceptTerms) {
      showAlert("Please accept the terms and conditions.");
      return;
    }

    
    setPaymentStatus("processing");

    try {
      
      const raw = localStorage.getItem("checkoutData");
      const checkoutData = raw ? JSON.parse(raw) : null;

      if (!checkoutData) {
        throw new Error("Checkout data not found.");
      }


      const finalData: CheckoutFormData = {
        paymentMethod: formData.paymentMethod,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        fee: checkoutData.shippingFee ?? 0,
        tax: checkoutData.tax ?? 0,
        cartItems: checkoutData.cartItems ?? [],
        currency: formData.paymentMethod === "oxapay" ? "USD" : "VND",
        couponCode: checkoutData.couponCode ?? null,
        fullName: formData.fullName,
        address: formData.address,
        province: formData.province,
        ward: formData.ward,
        phone: formData.phone,
        isNew: formData.isNew ?? false,
        note: formData.note,
        giftMessage: formData.giftMessage,
        saveInfo: formData.saveInfo,
        acceptTerms: formData.acceptTerms,
      };

     
      if (finalData.isNew) {
        const recipient_new: RecipientCreateDTO = {
          fullName: finalData.fullName,
          addressLine: finalData.address,
          province: finalData.province,
          ward: finalData.ward,
          phoneNumber: finalData.phone,
        };
        await RecipientService.post(recipient_new);
      }

      
      const order = await OrderService.createOrder(finalData);

      if (!order || !order.data.order_id) {
        throw new Error("Order creation failed or order ID not returned.");
      }
      removeOrderedItemsFromCart(checkoutData.cartItems);
      localStorage.removeItem("checkoutData");
      window.dispatchEvent(new Event("cartUpdated"));
      await delay(3000);
      const paymentResponse = await PaymentService.getPaymentByOrderId(order.data.order_id);
      console.log(paymentResponse);
      
      const paymentUrl = paymentResponse?.data?.paymentUrl;

      if (paymentUrl) {

        window.open(paymentUrl, "_blank");
        

        
        
      } else if (formData.paymentMethod === "cod") {

        setOrderNumber(order.data.order_code);
        setPaymentStatus("success");
      } else {
        throw new Error("Payment method not supported or payment URL not available.");
      }

    } catch (error) {
      console.error("Order error:", error);
      setPaymentStatus("failed");
      showAlert("Failed to place order. Please try again.");
    }
  };


  if (paymentStatus === "processing") {
    return <PaymentProcessing />;
  }

  if (paymentStatus === "success") {
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
            isProcessing={paymentStatus === "processing"}
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