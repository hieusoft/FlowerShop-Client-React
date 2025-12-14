import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentProcessing() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-10 space-y-4">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">
            Processing your payment
          </h2>
          <p className="text-muted-foreground">
            Please complete the payment in the opened window.
            Do not close this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
