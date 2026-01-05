# LMS Technical Documentation
## Complete Project Documentation for CRM/Project Tracking

**Project Name:** Learning Management System (LMS)  
**Version:** 1.0.0  
**Last Updated:** Current Date  
**Status:** Production Ready (75% Complete)  
**Live URL:** https://cognify.traincapetech.in  
**Backend URL:** https://lms-backend-5s5x.onrender.com

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Architecture](#frontend-architecture)
8. [Features Implementation](#features-implementation)
9. [Authentication & Authorization](#authentication--authorization)
10. [Deployment](#deployment)
11. [Environment Variables](#environment-variables)
12. [Testing](#testing)
13. [Future Roadmap](#future-roadmap)

---

## 🎯 PROJECT OVERVIEW

### Purpose
A comprehensive Learning Management System (LMS) platform that enables instructors to create and manage courses, students to enroll and learn, and administrators to oversee the platform operations.

### Key Features
- ✅ User Authentication & Authorization (JWT-based)
- ✅ Course Creation & Management (Multi-step workflow)
- ✅ Student Enrollment System
- ✅ Progress Tracking & Analytics
- ✅ Video & Document Content Delivery
- ✅ Quiz System
- ✅ Shopping Cart & E-commerce
- ✅ Admin Dashboard
- ✅ Instructor Dashboard
- ✅ Wishlist Management
- ✅ Coupon System
- ✅ Newsletter Management

### Completion Status
- **Overall Completion:** 75%
- **Core Features:** 90% Complete
- **Advanced Features:** 50% Complete

---

## 🏗️ ARCHITECTURE

### System Architecture
```
┌─────────────────┐
│   Frontend      │  React + Vite + Tailwind CSS
│   (Client)      │  Port: 5173 (dev) / Production
└────────┬────────┘
         │ HTTPS/REST API
         │
┌────────▼────────┐
│   Backend       │  Node.js + Express
│   (Server)      │  Port: 5001
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │  MongoDB Atlas
│   (MongoDB)     │  Cloud Database
└─────────────────┘
```

### Design Patterns
- **MVC Architecture:** Model-View-Controller pattern
- **RESTful API:** REST principles for API design
- **JWT Authentication:** Stateless authentication
- **Component-Based UI:** React component architecture
- **State Management:** Zustand for global state

---

## 💻 TECHNOLOGY STACK

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI Framework |
| Vite | 7.0.3 | Build Tool & Dev Server |
| React Router DOM | 7.6.3 | Client-side Routing |
| Tailwind CSS | 4.1.17 | Styling Framework |
| Axios | 1.13.2 | HTTP Client |
| Zustand | 5.0.9 | State Management |
| Framer Motion | 12.23.24 | Animations |
| Sonner | 2.0.7 | Toast Notifications |
| PDF.js | 5.4.394 | PDF Viewer |
| React Icons | 5.5.0 | Icon Library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | Runtime Environment |
| Express.js | 4.21.2 | Web Framework |
| MongoDB | 8.16.3 | Database (via Mongoose) |
| Mongoose | 8.16.3 | ODM for MongoDB |
| JWT | 9.0.2 | Authentication |
| Bcryptjs | 3.0.2 | Password Hashing |
| Multer | 2.0.2 | File Upload |
| Nodemailer | 7.0.5 | Email Service |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |
| Dotenv | 17.2.0 | Environment Variables |

### Database
- **MongoDB Atlas:** Cloud-hosted NoSQL database
- **Collections:** Users, Courses, PendingCourses, Enrollments, Progress, Cart, Coupons, Quizzes, Videos, etc.

### Deployment
- **Frontend:** Production hosting (cognify.traincapetech.in)
- **Backend:** Render.com (lms-backend-5s5x.onrender.com)
- **Database:** MongoDB Atlas (Cloud)

---

## 📁 PROJECT STRUCTURE

```
LMS-Website-Mohit/
│
├── client/                          # Frontend Application
│   ├── src/
│   │   ├── components/            # Reusable UI Components
│   │   │   ├── ui/                 # Base UI Components (Button, Card, etc.)
│   │   │   ├── Navbar.jsx          # Navigation Bar
│   │   │   ├── Footer.jsx          # Footer Component
│   │   │   └── FeaturedCourses.jsx  # Featured Courses Display
│   │   │
│   │   ├── Pages/                  # Page Components
│   │   │   ├── Home1.jsx           # Homepage
│   │   │   ├── Courses.jsx         # Course Listing
│   │   │   ├── CourseDetails.jsx  # Course Details Page
│   │   │   ├── MyLearning.jsx     # My Learning Dashboard
│   │   │   ├── LectureVideo.jsx    # Video Player Page
│   │   │   ├── Cart.jsx            # Shopping Cart
│   │   │   ├── Payment.jsx         # Payment Page
│   │   │   ├── Dashboard.jsx       # Course Creation Dashboard
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── [Other Pages]
│   │   │
│   │   ├── Store/                 # State Management
│   │   │   └── store.js           # Zustand Store
│   │   │
│   │   ├── utils/                 # Utility Functions
│   │   │   ├── api.js            # API Client Configuration
│   │   │   └── [Other Utils]
│   │   │
│   │   ├── App.jsx                # Main App Component
│   │   └── main.jsx               # Entry Point
│   │
│   ├── package.json
│   └── vite.config.js
│
├── LMS-Backend/                     # Backend Application
│   ├── config/
│   │   ├── db.js                   # Database Connection
│   │   └── r2.js                   # Cloud Storage Config
│   │
│   ├── controllers/                # Business Logic
│   │   ├── authController.js      # Authentication
│   │   ├── courseController.js     # Course Management
│   │   ├── enrollmentController.js # Enrollment System
│   │   ├── progressController.js   # Progress Tracking
│   │   ├── pendingCourseController.js
│   │   ├── profileController.js
│   │   └── [Other Controllers]
│   │
│   ├── models/                     # Database Models
│   │   ├── User.js                 # User Model
│   │   ├── Course.js               # Course Model
│   │   ├── Enrollment.js          # Enrollment Model
│   │   ├── Progress.js             # Progress Model
│   │   ├── PendingCourse.js
│   │   ├── Cart.js
│   │   ├── Coupon.js
│   │   └── [Other Models]
│   │
│   ├── routes/                      # API Routes
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── progressRoutes.js
│   │   └── [Other Routes]
│   │
│   ├── utils/                      # Utilities
│   │   ├── requireAuth.js         # Auth Middleware
│   │   ├── requireAdmin.js        # Admin Middleware
│   │   ├── requireInstructor.js   # Instructor Middleware
│   │   └── emailService.js        # Email Service
│   │
│   ├── uploads/                     # File Uploads (Local)
│   ├── server.js                   # Server Entry Point
│   └── package.json
│
└── Documentation/
    ├── LMS_COMPLETION_ANALYSIS.md
    └── TECHNICAL_DOCUMENTATION.md
```

---

## 🗄️ DATABASE SCHEMA

### Collections Overview

#### 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: ["student", "instructor", "admin"]),
  headline: String,
  bio: String,
  photoUrl: String,
  links: {
    website: String,
    facebook: String,
    linkedin: String,
    // ... other social links
  },
  notifications: [{
    message: String,
    type: String,
    read: Boolean,
    createdAt: Date
  }],
  wishlist: [ObjectId (ref: Course)],
  resetOtp: String,
  resetOtpExpires: Date,
  timestamps: true
}
```

#### 2. **Courses Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  subtitle: String,
  description: String,
  price: Number,
  thumbnailUrl: String,
  instructor: ObjectId (ref: User),
  learningObjectives: [String],
  requirements: [String],
  curriculum: [{
    sectionId: String,
    title: String,
    items: [{
      itemId: String,
      type: String (enum: ["lecture", "quiz", "document"]),
      title: String,
      videoId: ObjectId (ref: Video),
      documents: [{
        fileUrl: String,
        fileName: String
      }],
      quizId: ObjectId (ref: Quiz)
    }]
  }],
  pendingCourseId: ObjectId (ref: PendingCourse),
  published: Boolean,
  rating: Number,
  ratingsCount: Number,
  learners: Number,
  timestamps: true
}
```

#### 3. **Enrollments Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  course: ObjectId (ref: Course, indexed),
  enrolledAt: Date,
  completedAt: Date,
  isCompleted: Boolean,
  progress: Number (0-100),
  lastAccessedAt: Date,
  lastAccessedLecture: ObjectId,
  paymentId: String,
  paymentMethod: String (enum: ["stripe", "paypal", "razorpay", "upi", "card", "free"]),
  amountPaid: Number,
  timestamps: true
}
// Compound Index: { user: 1, course: 1 } (unique)
```

#### 4. **Progress Collection**
```javascript
{
  _id: ObjectId,
  enrollment: ObjectId (ref: Enrollment),
  user: ObjectId (ref: User, indexed),
  course: ObjectId (ref: Course, indexed),
  completedLectures: [{
    lectureId: ObjectId,
    itemId: String,
    completedAt: Date
  }],
  completedQuizzes: [{
    quizId: ObjectId (ref: Quiz),
    score: Number,
    maxScore: Number,
    completedAt: Date
  }],
  progressPercentage: Number (0-100),
  lastAccessedLecture: {
    lectureId: ObjectId,
    itemId: String,
    sectionId: String,
    accessedAt: Date
  },
  timeSpent: Number (minutes),
  isCompleted: Boolean,
  completedAt: Date,
  timestamps: true
}
// Compound Index: { user: 1, course: 1 } (unique)
```

#### 5. **PendingCourses Collection**
```javascript
{
  _id: ObjectId,
  instructor: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  status: String (enum: ["pending", "approved", "rejected"]),
  // ... course creation fields
  curriculum: [SectionSchema],
  timestamps: true
}
```

#### 6. **Cart Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    course: ObjectId (ref: Course),
    quantity: Number,
    addedAt: Date
  }],
  couponCode: String,
  discountPercentage: Number,
  totalBeforeDiscount: Number,
  totalAfterDiscount: Number,
  timestamps: true
}
```

#### 7. **Quizzes Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  course: ObjectId (ref: Course),
  questions: [{
    _id: ObjectId,
    questionText: String,
    options: [{
      _id: ObjectId,
      text: String,
      isCorrect: Boolean
    }]
  }],
  timestamps: true
}
```

---

## 🔌 API DOCUMENTATION

### Base URL
- **Development:** `http://localhost:5001/api`
- **Production:** `https://lms-backend-5s5x.onrender.com/api`

### Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### **Authentication Routes** (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with OTP | No |
| POST | `/api/auth/verify-otp` | Verify OTP | No |

#### **Enrollment Routes** (`/api/enrollments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/enrollments/enroll` | Enroll in a course | Yes |
| GET | `/api/enrollments/my-enrollments` | Get user's enrollments | Yes |
| GET | `/api/enrollments/check/:courseId` | Check enrollment status | Yes |
| DELETE | `/api/enrollments/unenroll/:courseId` | Unenroll from course | Yes |
| GET | `/api/enrollments/stats` | Get enrollment statistics | Yes |

#### **Progress Routes** (`/api/progress`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/progress/lecture/complete` | Mark lecture as completed | Yes |
| POST | `/api/progress/lecture/access` | Update last accessed lecture | Yes |
| GET | `/api/progress/course/:courseId` | Get course progress | Yes |
| POST | `/api/progress/quiz/complete` | Mark quiz as completed | Yes |

#### **Course Routes** (`/api/courses`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | Get all courses | No |
| GET | `/api/courses/:id` | Get course by ID | No |
| POST | `/api/courses` | Create course | Yes (Instructor) |
| PUT | `/api/courses/:id` | Update course | Yes (Instructor) |
| DELETE | `/api/courses/:id` | Delete course | Yes (Instructor/Admin) |

#### **Cart Routes** (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart/add` | Add course to cart | Yes |
| DELETE | `/api/cart/remove/:courseId` | Remove from cart | Yes |
| POST | `/api/cart/apply-coupon` | Apply coupon code | Yes |
| DELETE | `/api/cart/remove-coupon` | Remove coupon | Yes |

#### **Profile Routes** (`/api/profile`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/profile` | Get user profile | Yes |
| PUT | `/api/profile` | Update profile | Yes |
| GET | `/api/profile/get-wishlist` | Get wishlist | Yes |
| POST | `/api/profile/add-to-wishlist` | Add to wishlist | Yes |
| DELETE | `/api/profile/remove-from-wishlist/:courseId` | Remove from wishlist | Yes |

#### **Admin Routes**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/instructor-requests/` | Get instructor requests | Yes (Admin) |
| PUT | `/api/instructor-requests/:id/approve` | Approve instructor | Yes (Admin) |
| PUT | `/api/instructor-requests/:id/reject` | Reject instructor | Yes (Admin) |
| GET | `/api/pending-courses/` | Get pending courses | Yes (Admin) |
| PUT | `/api/pending-courses/:id/approve` | Approve course | Yes (Admin) |
| PUT | `/api/pending-courses/:id/reject` | Reject course | Yes (Admin) |

#### **Public Routes** (`/api/public`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/public/stats` | Get platform statistics | No |

---

## 🎨 FRONTEND ARCHITECTURE

### Routing Structure
```javascript
/                           → Homepage
/courses                    → Course Listing
/course/:id                 → Course Details
/my-learning                → My Learning Dashboard
/lecture/:lectureId         → Video Player
/cart                       → Shopping Cart
/payment                    → Payment Page
/teach                      → Become Instructor
/form                       → Instructor Application
/create                     → Course Creation
/dashboard/:id              → Course Creation Dashboard
/instructor-dashboard      → Instructor Dashboard
/admin                      → Admin Dashboard
/login                      → Login Page
/signup                     → Signup Page
/wishlist                   → Wishlist
```

### State Management
- **Zustand Store:** Global state for courses, cart, user data
- **React Context:** Cart context for cart operations
- **Local Storage:** Token, user data, cart persistence

### Component Hierarchy
```
App.jsx
├── Navbar
├── Routes
│   ├── Home1
│   ├── Courses
│   ├── CourseDetails
│   ├── MyLearning
│   ├── LectureVideo
│   ├── Cart
│   ├── Payment
│   ├── Dashboard
│   └── [Other Pages]
└── Footer
```

---

## ⚙️ FEATURES IMPLEMENTATION

### 1. Authentication & Authorization ✅
- **JWT-based Authentication:** Stateless token system
- **Role-based Access Control:** Student, Instructor, Admin roles
- **Password Reset:** OTP-based password reset flow
- **Protected Routes:** Middleware-based route protection
- **Session Management:** localStorage-based session

### 2. Course Management ✅
- **Multi-step Creation:** 11-step course creation workflow
- **Curriculum Builder:** Sections and items (lectures, quizzes, documents)
- **Video Upload:** Local file upload system
- **Document Upload:** PDF and other document support
- **Thumbnail Upload:** Course thumbnail management
- **Admin Approval:** Course approval/rejection workflow

### 3. Student Enrollment System ✅
- **Enrollment Model:** Database model for enrollments
- **Enrollment API:** Complete CRUD operations
- **My Learning Page:** Dashboard with progress tracking
- **Access Control:** Enrollment verification for course access
- **Auto-enrollment:** Automatic enrollment after payment

### 4. Progress Tracking ✅
- **Progress Model:** Database model for progress
- **Lecture Completion:** Track completed lectures
- **Quiz Completion:** Track quiz scores
- **Progress Percentage:** Automatic calculation
- **Resume Functionality:** Last accessed lecture tracking
- **Course Completion:** Automatic completion detection

### 5. E-commerce ✅
- **Shopping Cart:** Add/remove courses
- **Coupon System:** Discount code application
- **Payment Page:** Payment method selection UI
- **Cart Persistence:** Backend + localStorage
- **Price Calculation:** Discount and total calculation

### 6. Quiz System ✅
- **Quiz Creation:** Create quizzes with questions
- **Multiple Choice:** Question type support
- **Quiz Taking:** Student quiz interface
- **Results Storage:** Quiz results in database
- **Score Calculation:** Automatic scoring

### 7. Admin Features ✅
- **Admin Dashboard:** Overview of platform
- **Instructor Management:** Approve/reject instructors
- **Course Approval:** Approve/reject courses
- **Coupon Management:** Create/manage coupons
- **Newsletter Management:** Send newsletters

### 8. Instructor Features ✅
- **Instructor Dashboard:** Course management
- **Course Creation:** Full course creation workflow
- **Course Editing:** Edit existing courses
- **Course Status:** Track course approval status

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Flow
1. User registers/logs in
2. Server validates credentials
3. JWT token generated (7-day expiry)
4. Token stored in localStorage
5. Token sent in Authorization header for protected routes

### Authorization Middleware
- **requireAuth:** Verifies JWT token
- **requireAdmin:** Verifies admin role
- **requireInstructor:** Verifies instructor role

### Protected Routes
- All enrollment routes require authentication
- All progress routes require authentication
- Admin routes require admin role
- Instructor routes require instructor role

---

## 🚀 DEPLOYMENT

### Frontend Deployment
- **Platform:** Production hosting
- **URL:** https://cognify.traincapetech.in
- **Build Command:** `npm run build`
- **Environment Variables:** `VITE_API_BASE_URL`

### Backend Deployment
- **Platform:** Render.com
- **URL:** https://lms-backend-5s5x.onrender.com
- **Start Command:** `node server.js`
- **Port:** 5001 (default)

### Database
- **Platform:** MongoDB Atlas
- **Connection:** Cloud-hosted
- **Backup:** Automatic backups

---

## 🔧 ENVIRONMENT VARIABLES

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://...

# Server
PORT=5001
NODE_ENV=production

# Authentication
JWT_SECRET=your_jwt_secret_key

# Admin
ADMIN_EMAIL=admin@traincape.com
ADMIN_PASSWORD=Admin@123

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://lms-backend-5s5x.onrender.com
```

---

## 🧪 TESTING

### Manual Testing
- ✅ User registration and login
- ✅ Course creation workflow
- ✅ Enrollment system
- ✅ Progress tracking
- ✅ Cart and payment flow
- ✅ Admin operations
- ✅ Instructor operations

### Testing Checklist
- [ ] Unit tests for controllers
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security testing

---

## 📊 FUTURE ROADMAP

### Phase 2: Payment Gateway Integration (Next Priority)
- [ ] Stripe integration
- [ ] PayPal integration
- [ ] Razorpay integration
- [ ] Payment webhooks
- [ ] Purchase history

### Phase 2: Reviews & Ratings
- [ ] Review model
- [ ] Review submission
- [ ] Review display
- [ ] Rating aggregation

### Phase 3: Q&A/Discussion System
- [ ] Discussion model
- [ ] Q&A threads
- [ ] Instructor responses
- [ ] Upvoting system

### Phase 4: Advanced Features
- [ ] Certificate generation
- [ ] Analytics dashboard
- [ ] Advanced search
- [ ] Video player enhancements
- [ ] Assignments & grading

---

## 📝 API RESPONSE FORMATS

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### Enrollment Response
```json
{
  "message": "Successfully enrolled in course",
  "enrollment": {
    "_id": "...",
    "user": "...",
    "course": { ... },
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "progress": 0
  }
}
```

### Progress Response
```json
{
  "progressPercentage": 45,
  "completedLectures": [...],
  "completedQuizzes": [...],
  "isCompleted": false,
  "lastAccessedLecture": { ... }
}
```

---

## 🔍 KEY TECHNICAL DECISIONS

1. **JWT Authentication:** Stateless, scalable authentication
2. **MongoDB:** Flexible schema for course curriculum
3. **React + Vite:** Fast development and build times
4. **Zustand:** Lightweight state management
5. **Local File Storage:** Current implementation (can migrate to S3)
6. **Render.com:** Easy deployment for backend
7. **MongoDB Atlas:** Managed database service

---

## 📞 SUPPORT & MAINTENANCE

### Known Issues
- Payment gateway integration pending (mock flow implemented)
- Profile pages are placeholders
- Advanced analytics not implemented

### Maintenance Tasks
- Regular database backups
- Security updates
- Performance monitoring
- Error logging

---

## 📄 LICENSE & CREDITS

**Project:** Learning Management System  
**Developed By:** Development Team  
**Version:** 1.0.0  
**Last Updated:** Current Date

---

*This documentation is maintained for CRM/Project Tracking purposes.  
For detailed feature analysis, see `LMS_COMPLETION_ANALYSIS.md`*

