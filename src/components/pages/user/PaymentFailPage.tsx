'use client';

import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function PaymentFailPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/checkout');
  };

  const handleBackToCart = () => {
    router.push('/cart');
  };
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-4 pt-20">

      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-10 text-center">
        
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

      
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Payment Failed
          </h1>

          
          <p className="text-gray-600 mb-8">
            We couldn&apos;t process your payment. Please try again or use a different payment method.
          </p>

         
          <div className="bg-gray-100 rounded-lg p-4 mb-8 text-sm">
            <p className="font-medium">Transaction ID: TXN-{Date.now().toString().slice(-8)}</p>
            <p className="text-gray-500 mt-1">
              No money has been deducted from your account.
            </p>
          </div>

        
          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 h-12"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleBackToCart}
              variant="outline"
              className="w-full h-12"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Cart
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-8">
            Need help? Contact our support team at support@example.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}