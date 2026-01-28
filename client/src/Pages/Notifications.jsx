import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { notificationAPI } from "@/utils/api";
import { motion } from "framer-motion";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaBullhorn,
    FaBell,
    FaTrash,
    FaCheckDouble,
    FaFilter,
    FaInfoCircle
} from "react-icons/fa";
import { toast } from "sonner";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        unread: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationAPI.getNotifications(1, 100); // Fetch mostly recent
            setNotifications(res.data.notifications || []);
            setStats({
                total: res.data.pagination?.total || 0,
                unread: (res.data.notifications || []).filter(n => !n.read).length
            });
        } catch (err) {
            console.error("Error fetching notifications:", err);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await notificationAPI.getUnreadCount();
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id, actionUrl) => {
        try {
            await notificationAPI.markAsRead(id);
            // Update local state
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Navigate if action URL exists
            if (actionUrl) {
                navigate(actionUrl);
            }
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch (err) {
            console.error(err);
            toast.error("Failed to mark all as read");
        }
    };

    const deleteNotification = async (e, id) => {
        e.stopPropagation(); // Prevent triggering card click
        try {
            await notificationAPI.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Notification deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'course_approved':
                return <FaCheckCircle className="text-green-500 text-xl" />;
            case 'course_rejected':
                return <FaTimesCircle className="text-red-500 text-xl" />;
            case 'admin_broadcast':
                return <FaBullhorn className="text-blue-500 text-xl" />;
            case 'course_changes':
                return <FaInfoCircle className="text-orange-500 text-xl" />;
            default:
                return <FaBell className="text-gray-500 text-xl" />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        if (filter === 'admin') return n.type === 'admin_broadcast';
        if (filter === 'course') return ['course_approved', 'course_rejected', 'course_changes'].includes(n.type);
        return true;
    });

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center w-full h-screen justify-center">
                <Spinner className="text-blue-600 size-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 font-poppins">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 mb-1">
                            Notifications
                        </h1>
                        <p className="text-gray-600">
                            Stay updated with your courses and announcements
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            onClick={markAllAsRead}
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 border-blue-200"
                        >
                            <FaCheckDouble />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => setFilter("all")}
                        className={`rounded-full ${filter === 'all' ? 'bg-blue-600' : ''}`}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "unread" ? "default" : "outline"}
                        onClick={() => setFilter("unread")}
                        className={`rounded-full ${filter === 'unread' ? 'bg-blue-600' : ''}`}
                    >
                        Unread
                    </Button>
                    <Button
                        variant={filter === "course" ? "default" : "outline"}
                        onClick={() => setFilter("course")}
                        className={`rounded-full ${filter === 'course' ? 'bg-blue-600' : ''}`}
                    >
                        Course Updates
                    </Button>
                    <Button
                        variant={filter === "admin" ? "default" : "outline"}
                        onClick={() => setFilter("admin")}
                        className={`rounded-full ${filter === 'admin' ? 'bg-blue-600' : ''}`}
                    >
                        Admin Messages
                    </Button>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredNotifications.map((notification, index) => (
                            <motion.div
                                key={notification._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <div
                                    onClick={() => markAsRead(notification._id, notification.metadata?.actionUrl)}
                                    className={`
                    relative group p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md
                    ${notification.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'}
                  `}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className={`
                      flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                      ${notification.read ? 'bg-gray-100' : 'bg-white shadow-sm'}
                    `}>
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-semibold text-lg mb-1 ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {getTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                                                {notification.message}
                                            </p>
                                        </div>

                                        {/* Delete Action (visible on hover) */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 md:static md:top-auto md:right-auto">
                                            <button
                                                onClick={(e) => deleteNotification(e, notification._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete notification"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>

                                        {/* Unread Indicator */}
                                        {!notification.read && (
                                            <div className="absolute top-5 right-5 w-2 h-2 bg-blue-600 rounded-full md:hidden"></div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center bg-white border-dashed border-2">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaBell className="text-3xl text-gray-300" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No notifications found
                        </h2>
                        <p className="text-gray-500">
                            {filter !== 'all'
                                ? "Try changing the filter or check back later."
                                : "You're all caught up! Check back later for updates."}
                        </p>
                        {filter !== 'all' && (
                            <Button
                                variant="link"
                                onClick={() => setFilter('all')}
                                className="mt-2 text-blue-600"
                            >
                                Clear filters
                            </Button>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Notifications;
