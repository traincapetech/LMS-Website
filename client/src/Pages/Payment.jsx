import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUniversity, FaCreditCard, FaStripeS, FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { enrollmentAPI, cartAPI } from '@/utils/api';
import { toast } from 'sonner';

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
  const [processing, setProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to proceed with payment");
        navigate("/login");
        return;
      }

      try {
        const res = await cartAPI.getCart();
        if (res.data?.items && res.data.items.length > 0) {
          setCartItems(res.data.items);
        } else {
          // Check localStorage cart as fallback
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCartItems(localCart);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        // Fallback to localStorage
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
      }
    };

    fetchCart();
  }, []);

  // Handle payment completion (mock for now - will integrate actual gateway later)
  const handlePaymentComplete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to complete payment");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    setProcessing(true);

    try {
      // Enroll in all courses in cart
      const enrollmentPromises = cartItems.map(async (item) => {
        // Handle both backend cart structure (item.course) and local cart structure (item itself)
        const courseId = item.course?._id || item.course?.id || item.id || item._id;
        if (!courseId) {
          console.warn("Skipping item with no course ID:", item);
          return null;
        }

        try {
          await enrollmentAPI.enroll(courseId);
          return courseId;
        } catch (err) {
          // If already enrolled, that's okay
          if (err.response?.status === 400 && err.response?.data?.message?.includes("Already enrolled")) {
            return courseId;
          }
          console.error(`Failed to enroll in course ${courseId}:`, err);
          throw err;
        }
      });

      const enrolledCourses = await Promise.all(enrollmentPromises);
      const successfulEnrollments = enrolledCourses.filter(id => id !== null);

      // Clear cart
      try {
        // Clear backend cart
        for (const item of cartItems) {
          const courseId = item.course?._id || item.course?.id || item.id || item._id;
          if (courseId) {
            await cartAPI.removeFromCart(courseId).catch(() => {});
          }
        }
      } catch (err) {
        console.error("Error clearing cart:", err);
      }

      // Clear local cart
      localStorage.removeItem("cart");

      toast.success("Payment successful! You have been enrolled in all courses.");
      navigate("/my-learning");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 font-poppins">
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '2.5rem', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e5e7eb' }}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Cart
        </Button>
        
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 32 }}>Choose Payment Method</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {paymentOptions.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '18px 24px',
              borderRadius: 10,
              background: selected === opt.id ? '#e0f2fe' : '#f1f5f9',
              boxShadow: selected === opt.id ? '0 2px 8px #bae6fd' : '0 1px 4px #e5e7eb',
              cursor: 'pointer',
              border: selected === opt.id ? '2px solid #0ea5e9' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {opt.icon}
            <span style={{ fontWeight: 600, fontSize: 20 }}>{opt.label}</span>
          </div>
        ))}
      </div>
      {/* Show form/message for selected payment method */}
      {selected && (
        <div style={{ marginTop: 36, background: '#f9fafb', borderRadius: 10, padding: '24px 18px', textAlign: 'center', boxShadow: '0 1px 4px #e0e7ef' }}>
          {selected === 'upi' && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Pay via UPI</div>
              <input type="text" placeholder="Enter UPI ID" style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #bbb', width: '80%', marginBottom: 16 }} />
              <br />
              <button 
                onClick={handlePaymentComplete}
                disabled={processing}
                style={{ 
                  background: processing ? '#94a3b8' : '#0ea5e9', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '10px 28px', 
                  fontWeight: 600, 
                  fontSize: 16, 
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
            </>
          )}
          {selected === 'card' && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Pay with Credit/Debit Card</div>
              <input type="text" placeholder="Card Number" style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #bbb', width: '80%', marginBottom: 10 }} /><br />
              <input type="text" placeholder="Expiry (MM/YY)" style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #bbb', width: '38%', marginRight: 8, marginBottom: 10 }} />
              <input type="text" placeholder="CVV" style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #bbb', width: '38%', marginBottom: 16 }} /><br />
              <button 
                onClick={handlePaymentComplete}
                disabled={processing}
                style={{ 
                  background: processing ? '#94a3b8' : '#6366f1', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '10px 28px', 
                  fontWeight: 600, 
                  fontSize: 16, 
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
            </>
          )}
          {selected === 'stripe' && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Pay securely with Stripe</div>
              <button 
                onClick={handlePaymentComplete}
                disabled={processing}
                style={{ 
                  background: processing ? '#94a3b8' : '#635bff', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '12px 36px', 
                  fontWeight: 600, 
                  fontSize: 18, 
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Processing...' : 'Pay with Stripe'}
              </button>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Payment; 