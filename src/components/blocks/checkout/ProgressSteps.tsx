"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressStepsProps {
  step: number;
}

export default function ProgressSteps({ step }: ProgressStepsProps) {
  const getProgressValue = () => {
    switch (step) {
      case 1:
        return 25;
      case 2:
        return 50;
      case 3:
        return 75;
      case 4:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <span className="text-sm text-gray-500">Step {step} of 4</span>
      </div>

      <Progress value={getProgressValue()} className="h-2" />

      <div className="flex justify-between mt-4">
        <div
          className={`text-center ${
            step >= 1 ? "text-primary" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
              step >= 1 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className="text-sm">Contact</span>
        </div>

        <div
          className={`text-center ${
            step >= 2 ? "text-primary" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
              step >= 2 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className="text-sm">Shipping</span>
        </div>

        <div
          className={`text-center ${
            step >= 3 ? "text-primary" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
              step >= 3 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
          <span className="text-sm">Message</span>
        </div>
        <div
          className={`text-center ${
            step >= 4 ? "text-primary" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
              step >= 4 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            4
          </div>
          <span className="text-sm">Payment</span>
        </div>
      </div>
    </div>
  );
}
