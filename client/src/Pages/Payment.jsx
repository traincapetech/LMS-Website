import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useMemo, useState } from "react";
import { FaUniversity, FaCreditCard, FaStripeS } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentsAPI } from "@/utils/api";
import { useStore } from "../Store/store";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";

const paymentOptions = [
  {
    id: "upi",
    label: "UPI",
    id: "upi",
    label: "UPI",
    icon: <FaUniversity size={36} color="#0ea5e9" />,
  },
  {
    id: "card",
    label: "Credit/Debit Card",
    id: "card",
    label: "Credit/Debit Card",
    icon: <FaCreditCard size={36} color="#6366f1" />,
  },
  {
    id: "stripe",
    label: "Stripe Payment",
    id: "stripe",
    label: "Stripe Payment",
    icon: <FaStripeS size={36} color="#635bff" />,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    icon: <FaUniversity size={36} color="#10b981" />,
  },
];

const Payment = () => {
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { backendCart, fetchBackendCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, format } = useCurrency();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    fetchBackendCart();
  }, [fetchBackendCart, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const orderId = params.get("orderId");
    const sessionId = params.get("session_id");

    if (status === "success" && orderId && sessionId) {
      const confirmStripe = async () => {
        try {
          setProcessing(true);
          const res = await paymentsAPI.confirmOrder({
            orderId,
            paymentMethod: "stripe",
            paymentReference: sessionId,
          });

          if (res.data?.order?.status === "paid") {
            toast.success("Payment confirmed. Enrollment unlocked!");
            navigate("/my-learning");
          } else {
            toast.error("Payment not confirmed yet.");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Payment confirmation failed");
        } finally {
          setProcessing(false);
        }
      };
      confirmStripe();
    }
  }, [location.search, navigate]);

  const cartSummary = useMemo(() => {
    if (!backendCart) return null;
    if (!backendCart.items || backendCart.items.length === 0) return null;
    const total = Number(backendCart.totalAfterDiscount || 0);
    const subtotal = Number(backendCart.totalBeforeDiscount || 0);
    return { total, subtotal };
  }, [backendCart]);

  const handlePayment = async () => {
    if (!selected) {
      toast.error("Please choose a payment method");
      return;
    }

    try {
      setProcessing(true);

      if (selected === "stripe") {
        const sessionRes = await paymentsAPI.createStripeSession({
          paymentMethod: "stripe",
          currency,
        });

        if (sessionRes.data?.order?.status === "paid") {
          toast.success("Payment completed. Enrollment unlocked!");
          navigate("/my-learning");
          return;
        }

        const checkoutUrl = sessionRes.data?.url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        toast.error("Stripe session could not be created");
        return;
      }

      const checkout = await paymentsAPI.checkoutCart({
        paymentMethod: selected,
        currency,
      });

      const order = checkout.data?.order;
      if (!order) {
        toast.error("Unable to create order");
        return;
      }

      if (order.status === "paid") {
        toast.success("Payment completed. Enrollment unlocked!");
        navigate("/my-learning");
        return;
      }

      const confirm = await paymentsAPI.confirmOrder({
        orderId: order._id,
        paymentMethod: selected,
        paymentReference: `manual-${Date.now()}`,
      });

      if (confirm.data?.order?.status === "paid") {
        toast.success("Payment completed. Enrollment unlocked!");
        navigate("/my-learning");
      } else {
        toast.error("Payment not completed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card
      className="my-30 mx-auto px-5 py-5"
      style={{
        maxWidth: 600,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px #e5e7eb",
        marginTop: "100px",
        marginBottom: "100px",
      }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Choose Payment Method
        </CardTitle>
        <p className="text-center text-gray-500">
          Total Amount: $
          {cart
            .reduce(
              (acc, item) =>
                acc +
                (typeof item.price === "string"
                  ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
                  : item.price),
              0
            )
            .toFixed(2)}
        </p>
      </CardHeader>
      <CardContent
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        {cartSummary && (
          <div style={{ textAlign: "center", fontWeight: 600 }}>
            Total due: {format(cartSummary.total)}
          </div>
        )}
        {!cartSummary && (
          <div style={{ textAlign: "center", color: "#666" }}>
            Your cart is empty. Add a course before paying.
          </div>
        )}
        {paymentOptions.map((opt) => (
          <div
            className={`bg-gray-100 ${
              selected === opt.id ? "bg-blue-50 border border-blue-600" : ""
            }`}
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "18px 24px",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s",
              border:
                selected === opt.id
                  ? "2px solid #2563eb"
                  : "2px solid transparent",
            }}
          >
            {opt.icon}
            <span style={{ fontWeight: 600, fontSize: 18 }}>{opt.label}</span>
          </div>
        ))}
      </CardContent>
      {/* Show form/message for selected payment method */}
      {selected && cartSummary && (
        <div
          style={{
            marginTop: 24,
            background: "#f9fafb",
            borderRadius: 10,
            padding: "24px 18px",
            textAlign: "center",
            boxShadow: "0 1px 4px #e0e7ef",
          }}
        >
          {selected === "stripe" ? (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                Pay securely with Stripe
              </div>
              <input
                type="text"
                placeholder="Enter UPI ID"
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  width: "80%",
                  marginBottom: 16,
                }}
              />
              <br />
              <Button
                className="bg-Accent px-5 py-4  hover:bg-Accent/80"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </Button>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                {paymentOptions.find((o) => o.id === selected)?.label}
              </div>
              <input
                type="text"
                placeholder="Card Number"
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  width: "80%",
                  marginBottom: 10,
                }}
              />
              <br />
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  width: "38%",
                  marginRight: 8,
                  marginBottom: 10,
                }}
              />
              <input
                type="text"
                placeholder="CVV"
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  width: "38%",
                  marginBottom: 16,
                }}
              />
              <br />
              <Button
                className="bg-Accent px-5 py-4  hover:bg-Accent/80"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </Button>
            </>
          )}
          {selected === "stripe" && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                Pay securely with Stripe
              </div>
              <Button
                className="bg-Accent px-5 py-4  hover:bg-Accent/80"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay with Stripe"}
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default Payment;
