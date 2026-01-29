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

  // Sync backend cart coupon code to local state
  useEffect(() => {
    if (backendCart?.couponCode) {
      setCouponCode(backendCart.couponCode);
    }
  }, [backendCart]);

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

      const updatedCart = cart.filter((item) => {
        const itemId = item._id || item.id;
        return (
          itemId !== courseId && itemId?.toString() !== courseId?.toString()
        );
      });
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

  // ✅ LOGIC FIX: Merge local and backend carts to prevent losing items
  const [displayCart, setDisplayCart] = useState([]);

  useEffect(() => {
    const merged = [];
    const seenIds = new Set();

    // 1. Add items from backend cart
    if (backendCart && backendCart.items) {
      backendCart.items.forEach((item) => {
        const courseId = item.course?._id || item.course?.id;
        if (courseId) {
          merged.push({ ...item, isBackend: true });
          seenIds.add(courseId.toString());
        }
      });
    }

    // 2. Add items from local cart that aren't in backend
    cart.forEach((localItem) => {
      const localId = localItem._id || localItem.id;
      if (localId && !seenIds.has(localId.toString())) {
        merged.push({ course: localItem, isLocal: true });
        seenIds.add(localId.toString());
      }
    });

    setDisplayCart(merged);
  }, [backendCart, cart]);

  // ✅ SYNC FIX: Automatically sync local items to backend if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && displayCart.some((item) => item.isLocal)) {
      const syncLocalItems = async () => {
        const localItems = displayCart.filter((item) => item.isLocal);
        for (const item of localItems) {
          try {
            await addToCartAPI(item.course._id || item.course.id);
          } catch (err) {
            console.log("Sync error for item:", item.course.title);
          }
        }
        fetchBackendCart(); // Refresh after sync
      };
      syncLocalItems();
    }
  }, [displayCart, addToCartAPI, fetchBackendCart]);

  // ✅ CALCULATION FIX: Use merged cart for totals
  const totalBeforeDiscount = displayCart.reduce((sum, item) => {
    const course = item.course;
    const price = parseFloat(course?.price) || 0;
    return sum + price;
  }, 0);

  const backendTotal = parseFloat(backendCart?.totalAfterDiscount || 0);
  const totalAfterDiscount =
    backendTotal > 0 && !displayCart.some((item) => item.isLocal)
      ? backendTotal
      : totalBeforeDiscount - discountAmount;

  if (loading && displayCart.length === 0) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full font-poppins px-4 md:px-10 lg:px-20 py-10 md:py-20 lg:py-30">
      <Card className="w-full max-w-[800px] mt-10 md:m-0 px-4 py-6 md:px-10 md:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">🛒 Your Cart</h2>
          <Button
            className="bg-blue-600 w-full sm:w-auto"
            onClick={refreshLocalCart}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {!localStorage.getItem("token") && displayCart.length > 0 && (
          <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="font-semibold mb-1">
              💡 Login to unlock more features!
            </div>
            <div className="text-sm">
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
            <ul className="overflow-y-auto max-h-[500px] pr-1 md:pr-2 custom-scrollbar space-y-4">
              {displayCart.map((item, index) => {
                const course = item.course;
                if (!course) return null;
                const isSubscription = course.type === "subscription";

                return (
                  <li
                    key={course._id || course.id || index}
                    className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100">
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            alt={course.title}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                            {course.title ? course.title[0] : "C"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base md:text-lg font-semibold text-gray-900 truncate">
                          {isSubscription
                            ? course.name
                            : course.title.slice(0, 20) + "..."}
                        </div>
                        <div className="text-gray-500 text-xs md:text-sm line-clamp-1">
                          {isSubscription
                            ? course.description || "Subscription Plan"
                            : course.description || "Course description"}
                        </div>
                        <div className="mt-1 sm:hidden flex items-center justify-between">
                          <span className="text-lg font-semibold text-blue-600">
                            ${course.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                      <div className="hidden sm:block text-right">
                        <span className="text-xl font-semibold text-blue-600">
                          ${course.price}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 sm:px-4"
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
              <div className="mt-8 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Apply Coupon
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    disabled={couponApplied}
                  />
                  {!couponApplied ? (
                    <Button
                      onClick={applyCoupon}
                      className="bg-blue-600 hover:bg-blue-700 h-auto"
                    >
                      Apply
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={removeCoupon}
                      className="h-auto"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {couponMessage && (
                  <div
                    className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
                      couponApplied
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {couponMessage}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 px-4 md:px-0 divide-y divide-gray-100 bg-blue-50/50 rounded-xl overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-bold text-gray-900">
                    ${totalBeforeDiscount.toFixed(2)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span className="font-medium">Discount:</span>
                    <span className="font-bold">-${discountAmount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totalAfterDiscount.toFixed(2)}
                  </span>
                </div>
                <Button
                className="bg-linear-to-r text-lg py-6 px-10 w-full from-blue-500 to-indigo-500 mt-4 cursor-pointer"
                  onClick={handlePayment}
                  disabled={showPayment}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Cart;