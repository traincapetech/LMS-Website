import React, { useState, createContext, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { logNetworkStatus } from "./utils/networkTest";
import Navbar from "./components/Navbar";
import Plans from "./Pages/Plans";
import Home from "./Pages/Home1";
import Teach from "./Pages/teach";
import Signup from "./Pages/Signup";
import Login from "./Pages/login";
import Footer from "./components/Footer";
import Form from "./Pages/Form";
import Create from "./Pages/Create";
import Dashboard from "./Pages/Dashboard";
import SubPages from "./Pages/subPages";
import IBMPages from "./Pages/IBMPages";
import "./App.css";
import Html from "./CourseContent/Html";
import Cart from "./Pages/Cart";
import Payment from "./Pages/Payment";
import C from "./CourseContent/C";
import AdminDashboard from "./Pages/AdminDashboard";
import PendingCourseDetails from "./Pages/PendingCourseDetails";
import Courses from "./Pages/Courses";
import InstructorDashboard from "./Pages/InstructorDashboard";
import AdminInstructors from "./Pages/AdminInstructors";
import AdminCoupons from "./Pages/AdminCoupons";
import AdminNewsletter from "./Pages/AdminNewsletter";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import OtpVerification from "./Pages/OtpVerification";
import SetNewPassword from "./Pages/SetNewPassword";
import CourseDetails from "./Pages/CourseDetails";
import QuizPage from "./Pages/QuizPage";
import CreateQuiz from "./Pages/CreateQuiz";
import LectureVideo from "./Pages/LectureVideo";
import ResourceView from "./Pages/ResourceView";
import Messages from "./Pages/Messages";
import Home1 from "./Pages/Home1";
import Login1 from "./Pages/login1";
import Signup1 from "./Pages/signup1";
import Teach1 from "./Pages/teach1";
import Wishlist from "./Pages/Wishlist";
import AdminNewsletterDetail from "./Pages/AdminNewsletter-detail";
// Cart context setup
export const CartContext = createContext();

// Placeholder pages for profile and dropdown menu

const MyLearning = () => (
  <div style={{ padding: "2rem" }}>My Learning Page</div>
);


const Notifications = () => (
  <div style={{ padding: "2rem" }}>Notifications Page</div>
);

const AccountSettings = () => (
  <div style={{ padding: "2rem" }}>Account Settings Page</div>
);
const PaymentMethods = () => (
  <div style={{ padding: "2rem" }}>Payment Methods Page</div>
);
const Subscriptions = () => (
  <div style={{ padding: "2rem" }}>Subscriptions Page</div>
);
const Credits = () => <div style={{ padding: "2rem" }}>Credits Page</div>;
const PurchaseHistory = () => (
  <div style={{ padding: "2rem" }}>Purchase History Page</div>
);
const PublicProfile = () => (
  <div style={{ padding: "2rem" }}>Public Profile Page</div>
);
const Profile = () => <div style={{ padding: "2rem" }}>Profile Page</div>;
const Settings = () => <div style={{ padding: "2rem" }}>Settings Page</div>;

function App() {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Run network diagnostics on app start (commented out to avoid CORS issues)
  // useEffect(() => {
  //   console.log('🚀 App starting - running network diagnostics...');
  //   logNetworkStatus();
  // }, []);

  // Calculate total cart count from both local state and localStorage
  const getCartCount = () => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.length + localCart.length;
  };

  // Update cart count when cart changes
  React.useEffect(() => {
    setCartCount(getCartCount());
  }, [cart]);

  // Listen for localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      setCartCount(getCartCount());
    };

    const handleCustomCartChange = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCustomCartChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCustomCartChange);
    };
  }, []);

  const addToCart = (course) => {
    setCart((prev) => {
      // Prevent duplicates by title
      if (prev.find((item) => item.title === course.title)) return prev;
      const newCart = [...prev, course];
      // Dispatch custom event to update cart count
      setTimeout(() => window.dispatchEvent(new Event("cartUpdated")), 0);
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      <Router>
        <div className="">
          <Navbar cartCount={cartCount} />
          <div className="">
            <Routes>
              <Route path="/" element={<Home1 />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/teach" element={<Teach1 />} />
              {/* <Route path="/signup" element={<Signup1 />} /> */}
              <Route path="/login" element={<Login1 />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/form" element={<Form />} />
              <Route path="/create" element={<Create />} />
              <Route
                path="/dashboard/:pendingCourseId"
                element={<Dashboard />}
              />{" "}
              {/* this route for course creation  */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/preview/pending-course/:pendingCourseId"
                element={<PendingCourseDetails />}
              />
              <Route path="/admin/instructors" element={<AdminInstructors />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/newsletter" element={<AdminNewsletter />} />
              <Route path="/admin/newsletter-detail" element={<AdminNewsletterDetail />} />
              <Route path="/subpage" element={<SubPages />} />
              <Route path="/ibm" element={<IBMPages />} />
              <Route path="/html" element={<Html />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/c" element={<C />} />
              <Route
                path="/cpp"
                element={
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    Page not available yet!
                  </div>
                }
              />
              <Route path="/courses" element={<Courses />} />
              <Route
                path="/instructor-dashboard"
                element={<InstructorDashboard />}
              />
              <Route
                path="/instructor/edit/:pendingCourseId"
                element={<Dashboard />}
              />{" "}
              {/* this is edit route*/}
              <Route path="/verify-otp" element={<OtpVerification />} />
              <Route path="/set-new-password" element={<SetNewPassword />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              {/* Profile and dropdown menu routes */}
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/payment-methods" element={<PaymentMethods />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/public-profile" element={<PublicProfile />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/createQuiz" element={<CreateQuiz />} />
              <Route path="/lecture/:lectureId" element={<LectureVideo />} />
              <Route path="/resource/:id" element={<ResourceView />} />\
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartContext.Provider>
  );
}

export default App;
