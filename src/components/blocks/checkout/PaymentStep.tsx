"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, ArrowLeft } from "lucide-react";

interface PaymentStepProps {
  formData: {
    paymentMethod: string;
    acceptTerms: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  onPrevStep: () => void;
}

export default function PaymentStep({
  formData,
  onInputChange,
  onPlaceOrder,
  isProcessing,
  onPrevStep,
}: PaymentStepProps) {
  return (
    <>
      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Payment Method</CardTitle>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => onInputChange("paymentMethod", value)}
          >
            {/* VNPAY */}
            <div className="flex items-center space-x-2 rounded-lg border p-4 mb-2 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="vnpay" id="vnpay" />
              <div className="flex-1">
                <Label htmlFor="vnpay" className="cursor-pointer">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://i.ibb.co/27n0BDVR/images.png"
                      alt="VNPAY"
                      className="h-10 w-auto object-contain"
                    />
                    <div>
                      <p className="font-medium">VNPAY</p>
                      <p className="text-sm text-gray-500">
                        Pay securely via VNPAY gateway
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>

            {/* MOMO */}
            <div className="flex items-center space-x-2 rounded-lg border p-4 mb-2 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="momo" id="momo" />
              <div className="flex-1">
                <Label htmlFor="momo" className="cursor-pointer">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://i.ibb.co/KxBw3xSH/momo.png"
                      alt="MOMO"
                      className="h-10 w-auto object-contain"
                    />
                    <div>
                      <p className="font-medium">MOMO Wallet</p>
                      <p className="text-sm text-gray-500">
                        Pay quickly via MOMO e-wallet
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>

            {/* OXAPAY */}
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="oxapay" id="oxapay" />
              <div className="flex-1">
                <Label htmlFor="oxapay" className="cursor-pointer">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://i.ibb.co/Jjkws4vC/oxa.jpg"
                      alt="OXAPAY"
                      className="h-10 w-auto object-contain"
                    />
                    <div>
                      <p className="font-medium">OXAPAY</p>
                      <p className="text-sm text-gray-500">
                        Global secure payment via OXAPAY
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                onInputChange("acceptTerms", checked as boolean)
              }
            />
            <Label htmlFor="terms" className="text-sm leading-none">
              I agree to the{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary hover:underline">
                    Terms & Conditions
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Terms & Conditions</DialogTitle>
                    <DialogDescription>
                      Please read carefully before placing your order...
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>{" "}
              of the store.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={onPlaceOrder}
          disabled={isProcessing || !formData.acceptTerms}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Place Order
            </>
          )}
        </Button>
      </div>
    </>
  );
}
