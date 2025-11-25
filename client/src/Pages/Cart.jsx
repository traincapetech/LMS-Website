import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../App';
import { FaHtml5, FaCuttlefish, FaCode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const courseIcons = {
  'ibm-html': <FaHtml5 size={40} color="#e44d26" />,
  'ibm-c': <FaCuttlefish size={40} color="#00599C" />,
  'ibm-cpp': <FaCode size={40} color="#00599C" />,
};

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [backendCart, setBackendCart] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBackendCart();
    fetchAvailableCoupons();
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(localCart);
    
    const courseToAdd = localStorage.getItem('courseToAdd');
    if (courseToAdd) {
      try {
        const courseData = JSON.parse(courseToAdd);
        handleAddCourseToCart(courseData);
        localStorage.removeItem('courseToAdd');
      } catch (error) {
        console.error('Error processing course to add:', error);
        localStorage.removeItem('courseToAdd');
      }
    }
  }, []);

  const refreshLocalCart = () => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(localCart);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      refreshLocalCart();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('https://lms-backend-5s5x.onrender.com/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setBackendCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('https://lms-backend-5s5x.onrender.com/api/coupons/available', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAvailableCoupons(response.data);
    } catch (error) {
      console.error('Failed to fetch available coupons:', error);
    }
  };

  const handleAddCourseToCart = async (courseData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (courseData.isApiCourse) {
        if (!token) {
          alert('Please login to add API courses to cart');
          return;
        }
        try {
          await axios.post('https://lms-backend-5s5x.onrender.com/api/cart/add', {
            courseId: courseData.id
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const updatedCart = [...cart, courseData];
          setCart(updatedCart);
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          alert('Course added successfully!');
          fetchBackendCart(); // Refresh backend cart
        } catch (error) {
           alert('Error adding course');
        }
      } else {
        const updatedCart = [...cart, courseData];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        alert('Course added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding course to cart:', error);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (token && backendCart && backendCart.items.some(item => item.course._id === courseId)) {
        await axios.delete(`https://lms-backend-5s5x.onrender.com/api/cart/remove/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        await fetchBackendCart();
      }
      
      const updatedCart = cart.filter((item) => item.id !== courseId);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage('Please enter a coupon code');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCouponMessage('Please login to apply coupons');
        return;
      }
      const response = await axios.post('https://lms-backend-5s5x.onrender.com/api/cart/apply-coupon', {
        couponCode: couponCode.trim()
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setCouponApplied(true);
      setCouponMessage('Coupon applied successfully!');
      setDiscountAmount(response.data.discountAmount);
      setBackendCart(response.data.cart);
    } catch (error) {
      setCouponMessage(error.response?.data?.message || 'Failed to apply coupon');
      setCouponApplied(false);
    }
  };

  const removeCoupon = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.delete('https://lms-backend-5s5x.onrender.com/api/cart/remove-coupon', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCouponApplied(false);
      setCouponCode('');
      setCouponMessage('');
      setDiscountAmount(0);
      await fetchBackendCart();
    } catch (error) {
      console.error('Failed to remove coupon:', error);
    }
  };

  const handlePayment = () => {
    navigate('/payment');
  };

  // ✅ LOGIC FIX: Determine which cart to display
  const isBackendCartActive = backendCart && backendCart.items && backendCart.items.length > 0;
  const displayCart = isBackendCartActive ? backendCart.items : cart;

  // ✅ CALCULATION FIX: Use parseFloat to ensure numbers
  const totalBeforeDiscount = displayCart.reduce((sum, item) => {
    const course = isBackendCartActive ? item.course : item;
    const price = parseFloat(course?.price) || 0; // Convert string to number
    return sum + price;
  }, 0);
  
  // ✅ TOTAL FIX: If backend total is 0 (but we have items), use manual calc
  const backendTotal = parseFloat(backendCart?.totalAfterDiscount || 0);
  const totalAfterDiscount = backendTotal > 0 
    ? backendTotal 
    : (totalBeforeDiscount - discountAmount);

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2.5rem', background: '#f9fafb', borderRadius: 16, boxShadow: '0 4px 24px #e5e7eb' }}>
        <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Loading cart...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2.5rem', background: '#f9fafb', borderRadius: 16, boxShadow: '0 4px 24px #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: '#222' }}>🛒 Your Cart</h2>
        <button 
          onClick={refreshLocalCart}
          style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}
        >
          🔄 Refresh
        </button>
      </div>
      
      {!localStorage.getItem('token') && displayCart.length > 0 && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '12px 16px', marginBottom: '24px', color: '#92400e' }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>💡 Login to unlock more features!</div>
          <div style={{ fontSize: '14px' }}>Login to apply coupons, save your cart, and access API courses.</div>
        </div>
      )}
      
      {displayCart.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>
          Your cart is empty.
        </div>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {displayCart.map((item, index) => {
              const course = isBackendCartActive ? item.course : item;
              if (!course) return null;
              const isSubscription = course.type === 'subscription';
              
              return (
                <li key={course._id || course.id || index} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #f1f5f9', padding: '18px 24px', transition: 'box-shadow 0.2s', border: isSubscription ? '2px solid #10b981' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div>
                      {isSubscription ? (
                        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>📋</div>
                      ) : (
                        courseIcons[course.id] || <FaCode size={40} color="#888" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 20, color: '#222' }}>
                        {isSubscription ? course.name : course.title}
                      </div>
                      <div style={{ color: '#555', fontSize: 15, marginTop: 2 }}>
                        {isSubscription ? course.description : course.description}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: isSubscription ? '#10b981' : '#0ea5e9', fontSize: 18 }}>
                        ₹{course.price}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(course._id || course.id)} 
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #fca5a5', transition: 'background 0.2s' }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Coupon & Payment Section */}
          {localStorage.getItem('token') && (
            <div style={{ marginTop: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #f1f5f9', padding: '20px' }}>
              <h3 style={{ marginBottom: 16, fontWeight: 600, color: '#222' }}>Apply Coupon</h3>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} style={{ flex: 1, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} disabled={couponApplied} />
                {!couponApplied ? (
                  <button onClick={applyCoupon} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Apply</button>
                ) : (
                  <button onClick={removeCoupon} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                )}
              </div>
              {couponMessage && (
                <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 14, color: couponApplied ? '#059669' : '#dc2626', background: couponApplied ? '#d1fae5' : '#fee2e2' }}>{couponMessage}</div>
              )}
            </div>
          )}

          <div style={{ marginTop: 36, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #f1f5f9', padding: '24px 32px', textAlign: 'right' }}>
            <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>Subtotal: <span style={{ color: '#222' }}>₹{totalBeforeDiscount.toFixed(2)}</span></div>
            {discountAmount > 0 && <div style={{ fontSize: 16, color: '#059669', marginBottom: 8 }}>Discount: <span>-₹{discountAmount}</span></div>}
            <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 12 }}>Total: <span style={{ color: '#0ea5e9' }}>₹{totalAfterDiscount.toFixed(2)}</span></div>
            <button onClick={handlePayment} style={{ background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #c7d2fe', marginTop: 8 }} disabled={showPayment}>Proceed to Payment</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;