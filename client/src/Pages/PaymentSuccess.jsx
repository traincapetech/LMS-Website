import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { paymentAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (sessionId) {
      paymentAPI
        .verifyPayment({ sessionId })
        .then((res) => {
          if (res.data.success) {
            setStatus("success");
          } else {
            setStatus("failed");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("error");
        });
    }
  }, [sessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md text-center p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500 w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/my-learning")}
            >
              Go to My Learning
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
