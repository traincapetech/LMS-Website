import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md text-center p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="text-red-500 w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. Please try again or contact
            support if the issue persists.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => navigate("/cart")}
            >
              Return to Cart
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/contact-us")}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;
