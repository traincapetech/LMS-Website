# Deep Dive: Coupon System Code Changes

This document provides a detailed, file-by-file breakdown of the changes made to implement the coupon system and fix critical bugs. It compares the **Previous State** (or what was missing) with the **Current Implementation**.

---

## 1. Backend: `LMS-Backend/utils/requireInstructor.js`

**Change:** Relaxing Role Restrictions
**Reason:** Admins were getting "Access Denied" errors because the middleware strictly checked for `role === 'instructor'`.

### **Previous Code**
```javascript
module.exports = function requireInstructor(req, res, next) {
  // 🔴 STRICT CHECK: Only allows 'instructor' role
  if (!req.user || req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied. Instructor only.' });
  }
  next();
}
```

### **Current Code**
```javascript
module.exports = function requireInstructor(req, res, next) {
  // 🟢 RELAXED CHECK: Allows 'instructor' OR 'admin' roles
  if (!req.user || (req.user.role !== 'instructor' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Access denied. Instructor only.' });
  }
  next();
}
```

---

## 2. Backend: `LMS-Backend/routes/couponRoutes.js`

**Change 1:** New Endpoint `POST /validate-course` with ID Mismatch Fix
**Reason:** Students view the "Published Course" (ID A), but Instructors manage the "Draft Course" (ID B). We needed logic to validate coupons against *both* IDs safely.

### **Previous Code** (Non-existent or Basic Version)
*This endpoint did not exist in the original codebase.*

### **Current Code** (New Implementation)
```javascript
router.post('/validate-course', requireAuth, async (req, res) => {
    // ... basic validation ...

    // 🟢 KEY LOGIC: Check BOTH Course and PendingCourse existance
    let course = await Course.findById(courseId);
    let pendingCourse = null;
    if (!course) {
        pendingCourse = await PendingCourse.findById(courseId);
    }

    // ... fetch coupon ...

    // 🟢 ROBUST APPLICABILITY CHECK
    if (coupon.applicableCourses && coupon.applicableCourses.length > 0) {
        const validIds = [courseId];
        
        // Add cross-referenced IDs to the valid list
        if (course && course.pendingCourseId) validIds.push(course.pendingCourseId.toString());
        if (pendingCourse && pendingCourse.courseId) validIds.push(pendingCourse.courseId.toString());

        // Check if ANY of the valid IDs match the coupon
        const isApplicable = coupon.applicableCourses.some(id => 
            validIds.includes(id.toString())
        );

        if (!isApplicable) return res.status(400)...
    }
    // ... returns discount details ...
});
```

**Change 2:** Course-Specific Routes (`GET` & `POST`)
**Reason:** Allow creating/fetching coupons for a *specific* course, with security checks.

### **Current Code**
```javascript
// 🟢 GET /course/:courseId - Uses requireAuth + Manual Check
router.get('/course/:courseId', requireAuth, async (req, res) => {
    // ... fetch course ...
    
    // 🟢 SECURITY: Verify ownership
    const isOwner = targetCourse.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    // ... return coupons ...
});
```
*Note: We switched from `auth` middleware to `requireAuth` here to ensure `req.user` is correctly populated.*

---

## 3. Frontend: `client/src/Pages/Dashboard.jsx`

**Change:** Fixing React "Rules of Hooks" Crash
**Reason:** Hooks (`useEffect`) cannot be inside a conditional statement (like `switch` case). It causes React to crash.

### **Previous Code (CRASHING)**
```javascript
// Inside component
const renderContent = () => {
  switch (active) {
    case "promotions": {
      // 🔴 ERROR: useEffect inside specific case (Conditional Hook)
      useEffect(() => {
         fetchCoupons();
      }, []); 
      
      return <div>...</div>;
    }
  }
}
```

### **Current Code (FIXED)**
```javascript
export default function Dashboard() {
  // ... state declarations ...

  // 🟢 MOVED TO TOP LEVEL: Defined globally within component
  useEffect(() => {
    // 🟢 CONDITIONAL EXECUTION (Safe): Only run logic if active tab is "promotions"
    if (active === "promotions" && (courseId || pendingCourseId)) {
      const fetchCoupons = async () => { ... };
      fetchCoupons();
    }
  }, [active, courseId, pendingCourseId]);

  // Handler functions strictly defined at top level
  const handleCreateCoupon = async () => { ... };

  return (
    // ...
    {active === "promotions" && (
       // JSX only, no logic definitions
       <div>...</div>
    )}
  );
}
```

---

## 4. Frontend: `client/src/Pages/CourseDetails.jsx`

**Change:** Inline Coupon Apply & Cart Persistence
**Reason:** Students need to apply coupons *before* checkout and have that discount persist.

### **Current Code Enhancements**
**1. Persistence Logic (`handleAddToCart`)**
```javascript
const handleAddToCart = async () => {
  try {
    await addToCart(course); // Standard add
    
    // 🟢 PERSISTENCE: If coupon is applied, send it to Cart API immediately
    if (appliedCoupon) {
       await cartAPI.applyCoupon(appliedCoupon.couponCode);
       toast.success(`Included coupon ${appliedCoupon.couponCode}!`);
    }
    navigate("/cart");
  } catch (err) { ... }
};
```

**2. Inline UI (`handleApplyCoupon`)**
```javascript
const handleApplyCoupon = async () => {
    // 🟢 CALLS NEW VALIDATION ENDPOINT
    const res = await couponsAPI.validateForCourse(id, couponCode);
    if (res.data.valid) {
        setAppliedCoupon(res.data); // Stores full discount info locally
    }
};

// 🟢 DISPLAY LOGIC
{appliedCoupon ? (
    <>
      <span className="text-green-600">₹{appliedCoupon.discountedPrice}</span>
      <span className="line-through">₹{appliedCoupon.originalPrice}</span>
    </>
) : (
    <span>₹{course.price}</span>
)}
```

---

## 5. Frontend: `client/src/utils/api.js`

**Change:** Added Coupon API Wrapper
**Reason:** Centralize API calls for cleaner code usage.

### **Current Code**
```javascript
export const couponsAPI = {
  // Validate specifically for course page
  validateForCourse: (courseId, couponCode) =>
    api.post("/coupons/validate-course", { courseId, couponCode }),

  // Fetch course-specific coupons (for Instructor)
  getCouponsByCourse: (courseId) =>
    api.get(`/coupons/course/${courseId}`),

  // Create new coupon linked to course
  createCouponForCourse: (courseId, data) =>
    api.post(`/coupons/course/${courseId}`, data),

  // Delete coupon
  deleteCoupon: (id) => 
    api.delete(`/coupons/${id}`),
};
```
