import React, { useState, useEffect } from "react";
import axios from "@/utils/api";
import { toast } from "sonner";
import { Mail, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/Store/store";
import { Link } from "react-router-dom";

const AdminNewsletter = () => {
  const {
    subscribers,
    setSubscribers,
    subject,
    setSubject,
    message,
    setMessage,
    fetchSubscribers,
    sendSubscribers,
    loading,
    sending,
  } = useStore();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Subject and message are required");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to send this email to ${subscribers.length} subscribers?`
      )
    ) {
      return;
    }
    sendSubscribers(subject, message);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen mt-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Mail className="w-8 h-8 text-blue-600" />
          Newsletter Management
        </h1>
        <p className="text-gray-600 mt-2">Send updates to your subscribers</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-700">Subscribers</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {subscribers.length}
          </p>
          <div className="mt-4 text-sm text-gray-500 max-h-60 overflow-y-auto">
            <p className="mb-2 font-medium">Recent Subscribers:</p>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-1">
                {subscribers.slice(0, 5).map((sub, i) => (
                  <li key={i} className="truncate" title={sub.email}>
                    • {sub.email}
                  </li>
                ))}
                {subscribers.length > 5 && (
                  <li>...and {subscribers.length - 5} more</li>
                )}
              </ul>
            )}
          </div>
            <Link to="/admin/newsletter-detail">
            <span className="pt-5 text-blue-600 underline text-sm">View all subscribers</span>
            </Link>
        </div>

        {/* Compose Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Compose Email
          </h2>
          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g. New Course Alert: React Mastery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (HTML supported)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono text-sm"
                placeholder="<p>Hello students,</p><p>We have a great announcement...</p>"
              />
              <p className="text-xs text-gray-500 mt-1">
                Basic HTML tags are supported.
              </p>
            </div>

            <Button
              disabled={sending || subscribers.length === 0}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition
                ${
                  sending || subscribers.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
            >
              {sending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Broadcast
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;
