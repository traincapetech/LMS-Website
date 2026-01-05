import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6 font-poppins">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 opacity-20 mb-4">
            404
          </div>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been
          moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go to Homepage
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-6 py-3 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>

          <Link to="/courses">
            <Button
              variant="outline"
              className="px-6 py-3 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Courses
            </Link>
            <Link
              to="/teach"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Teach
            </Link>
            <Link
              to="/plans"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Plans & Pricing
            </Link>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

