import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useContext } from "react";
import { FaUniversity, FaCreditCard, FaStripeS } from "react-icons/fa";
import { CartContext } from "../App";
import { paymentAPI } from "../utils/api";

const paymentOptions = [
  {
    id: "upi",
    label: "UPI",
    icon: <FaUniversity size={36} color="#0ea5e9" />,
  },
  {
    id: "card",
    label: "Credit/Debit Card",
    icon: <FaCreditCard size={36} color="#6366f1" />,
  },
  {
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
  const { cart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  console.log("mohit",cart);

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      // Transform cart items for backend
      // Cart items structure depends on how they are stored.
      // Assuming { title, price, _id } based on common patterns.
      // If price is a string like "$10", need to parse it.

      const items = cart.map((item) => ({
        name: item.title || item.courseName || "Course",
        price:
          typeof item.price === "string"
            ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
            : item.price,
      })); 

      // Get user ID from local storage if available
      const userStr = localStorage.getItem("user");
      const userId = userStr ? JSON.parse(userStr)._id : null;
      const courseIds = cart.map((item) => item._id);

      const { data } = await paymentAPI.createCheckoutSession({
        items,
        userId,
        courseIds,
      });

      // Modern approach: redirect directly to the checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error ||
        "Payment initiation failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
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

      {selected && (
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
              <Button
                className="bg-indigo-600 px-8 py-3 w-full hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                onClick={handleStripePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                {paymentOptions.find((o) => o.id === selected)?.label}
              </div>
              <p className="mb-4 text-gray-600">
                This payment method is currently unavailable. Please check back
                later.
              </p>
              <Button
                disabled
                className="bg-gray-400 px-5 py-4 w-full cursor-not-allowed"
              >
                Pay Now
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default Payment;