import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { FaUniversity, FaCreditCard, FaStripeS } from 'react-icons/fa';

const paymentOptions = [
  {
    id: 'upi',
    label: 'UPI',
    icon: <FaUniversity size={36} color="#0ea5e9" />,
  },
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: <FaCreditCard size={36} color="#6366f1" />,
  },
  {
    id: 'stripe',
    label: 'Stripe Payment',
    icon: <FaStripeS size={36} color="#635bff" />,
  },
];

const Payment = () => {
  const [selected, setSelected] = useState(null);

  return (
    <Card
      className="my-30 mx-auto px-5 py-5"
      style={{
        maxWidth: 500,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px #e5e7eb",
      }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Choose Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent
        style={{ display: "flex", flexDirection: "column", gap: 28 }}
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
              // background: selected === opt.id ? '#e0f2fe' : '#f1f5f9',
              // boxShadow: selected === opt.id ? '0 2px 8px #bae6fd' : '0 1px 4px #e5e7eb',
              cursor: "pointer",
              // border: selected === opt.id ? '2px solid #0ea5e9' : '2px solid transparent',
              transition: "all 0.2s",
            }}
          >
            {opt.icon}
            <span style={{ fontWeight: 600, fontSize: 20 }}>{opt.label}</span>
          </div>
        ))}
      </CardContent>
      {/* Show form/message for selected payment method */}
      {selected && (
        <div
          style={{
            marginTop: 36,
            background: "#f9fafb",
            borderRadius: 10,
            padding: "24px 18px",
            textAlign: "center",
            boxShadow: "0 1px 4px #e0e7ef",
          }}
        >
          {selected === "upi" && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                Pay via UPI
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
              <Button className="bg-Accent px-5 py-4  hover:bg-Accent/80">
                Pay Now
              </Button>
            </>
          )}
          {selected === "card" && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                Pay with Credit/Debit Card
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
              <Button className="bg-Accent px-5 py-4  hover:bg-Accent/80">
                Pay Now
              </Button>
            </>
          )}
          {selected === "stripe" && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                Pay securely with Stripe
              </div>
              <Button className="bg-Accent px-5 py-4  hover:bg-Accent/80">
                Pay with Stripe
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default Payment; 