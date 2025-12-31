import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../App";
import { FaHtml5, FaCuttlefish, FaCode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, RefreshCcw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useStore } from "../Store/store";
import { toast } from "sonner";

const courseIcons = {
  "ibm-html": <FaHtml5 size={40} color="#e44d26" />,
  "ibm-c": <FaCuttlefish size={40} color="#00599C" />,
  "ibm-cpp": <FaCode size={40} color="#00599C" />,
};

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const {
    backendCart,
    fetchBackendCart,
    fetchAvailableCoupons,
    loading,
    addToCart: addToCartAPI,
    removeFromCart: removeFromCartAPI,
    applyCoupon: applyCouponAPI,
    removeCoupon: removeCouponAPI,
    couponApplied,
    couponMessage,
    discountAmount,
    setCouponMessage,
  } = useStore();

  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBackendCart();
    fetchAvailableCoupons();
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(localCart);

    const courseToAdd = localStorage.getItem("courseToAdd");
    if (courseToAdd) {
      try {
        const courseData = JSON.parse(courseToAdd);
        handleAddCourseToCart(courseData);
        localStorage.removeItem("courseToAdd");
      } catch (error) {
        console.error("Error processing course to add:", error);
        localStorage.removeItem("courseToAdd");
      }
    }
  }, []);

  const refreshLocalCart = () => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(localCart);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      refreshLocalCart();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAddCourseToCart = async (courseData) => {
    try {
      const token = localStorage.getItem("token");

      if (courseData.isApiCourse) {
        if (!token) {
          toast.error("Please login to add API courses to cart");
          return;
        }
        try {
          await addToCartAPI(courseData.id);

          const updatedCart = [...cart, courseData];
          setCart(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          toast.success("Course added successfully!");
        } catch (error) {
          toast.error("Error adding course");
        }
      } else {
        const updatedCart = [...cart, courseData];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        alert("Course added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding course to cart:", error);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (
        token &&
        backendCart &&
        backendCart.items.some((item) => item.course._id === courseId)
      ) {
        await removeFromCartAPI(courseId);
      }

      const updatedCart = cart.filter((item) => item.id !== courseId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setCouponMessage("Please login to apply coupons");
      return;
    }
    await applyCouponAPI(couponCode.trim());
  };

  const removeCoupon = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await removeCouponAPI();
    setCouponCode("");
  };

  const handlePayment = () => {
    navigate("/payment");
  };

  // ✅ LOGIC FIX: Determine which cart to display
  const isBackendCartActive =
    backendCart && backendCart.items && backendCart.items.length > 0;
  const displayCart = isBackendCartActive ? backendCart.items : cart;

  // ✅ CALCULATION FIX: Use parseFloat to ensure numbers
  const totalBeforeDiscount = displayCart.reduce((sum, item) => {
    const course = isBackendCartActive ? item.course : item;
    const price = parseFloat(course?.price) || 0; // Convert string to number
    return sum + price;
  }, 0);

  // ✅ TOTAL FIX: If backend total is 0 (but we have items), use manual calc
  const backendTotal = parseFloat(backendCart?.totalAfterDiscount || 0);
  const totalAfterDiscount =
    backendTotal > 0 ? backendTotal : totalBeforeDiscount - discountAmount;

  if (loading) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full font-poppins px-20">
      <Card className="mt-30 mb-10 px-10 py-10 w-[700px]">
        <div
          className="gap-10"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2 className="text-3xl font-semibold">🛒 Your Cart</h2>
          <Button className="bg-blue-600" onClick={refreshLocalCart}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>

        {!localStorage.getItem("token") && displayCart.length > 0 && (
          <div
            className="bg-blue-100 text-blue-600 border border-blue-500"
            style={{
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>
              💡 Login to unlock more features!
            </div>
            <div style={{ fontSize: "14px" }}>
              Login to apply coupons, save your cart, and access API courses.
            </div>
          </div>
        )}

        {displayCart.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", fontSize: 18 }}>
            Your cart is empty.
          </div>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {displayCart.map((item, index) => {
                const course = isBackendCartActive ? item.course : item;
                if (!course) return null;
                const isSubscription = course.type === "subscription";

                return (
                  <li
                    key={course._id || course.id || index}
                    className="gap-5"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 24,
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px #f1f5f9",
                      padding: "18px 24px",
                      transition: "box-shadow 0.2s",
                      border: isSubscription ? "2px solid #10b981" : "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 18 }}
                    >
                      <div>
                        {isSubscription ? (
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              background:
                                "linear-gradient(135deg, #10b981, #059669)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            📋
                          </div>
                        ) : (
                          courseIcons[course.id] || <Code />
                        )}
                      </div>
                      <div>
                        <div className="text-xl font-medium">
                          {isSubscription ? course.name : course.title}
                        </div>
                        <div className="text-gray-600 text-sm font-inter">
                          {isSubscription
                            ? course.description.slice(0, 200) + "..."
                            : course.description.slice(0, 200) + "..."}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 20 }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <span className="text-lg font-semibold">
                          ₹{course.price}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => removeFromCart(course._id || course.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Coupon & Payment Section */}
            {localStorage.getItem("token") && (
              <div
                style={{
                  marginTop: 24,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px #f1f5f9",
                  padding: "20px",
                }}
              >
                <h3
                  style={{ marginBottom: 16, fontWeight: 600, color: "#222" }}
                >
                  Apply Coupon
                </h3>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: 6,
                      fontSize: 14,
                    }}
                    disabled={couponApplied}
                  />
                  {!couponApplied ? (
                    <button
                      onClick={applyCoupon}
                      style={{
                        background: "#7c3aed",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "10px 20px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={removeCoupon}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "10px 20px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontSize: 14,
                      color: couponApplied ? "#059669" : "#dc2626",
                      background: couponApplied ? "#d1fae5" : "#fee2e2",
                    }}
                  >
                    {couponMessage}
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                marginTop: 36,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px #f1f5f9",
                padding: "24px 32px",
                textAlign: "right",
              }}
            >
              <div style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>
                Subtotal:{" "}
                <span style={{ color: "#222" }}>
                  ₹{totalBeforeDiscount.toFixed(2)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div
                  style={{ fontSize: 16, color: "#059669", marginBottom: 8 }}
                >
                  Discount: <span>-₹{discountAmount}</span>
                </div>
              )}
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#222",
                  marginBottom: 12,
                }}
              >
                Total:{" "}
                <span style={{ color: "#0ea5e9" }}>
                  ₹{totalAfterDiscount.toFixed(2)}
                </span>
              </div>
              <Button
                className="bg-linear-to-r from-blue-500 to-indigo-500 mt-4"
                onClick={handlePayment}
                disabled={showPayment}
              >
                Proceed to Payment
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Cart;
