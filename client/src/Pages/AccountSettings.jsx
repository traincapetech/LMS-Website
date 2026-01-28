import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiTrash2, FiShield, FiAlertTriangle, FiEye, FiEyeOff } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AccountSettings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("security");

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Password visibility state
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Close account state
    const [closePassword, setClosePassword] = useState("");
    const [closeMessage, setCloseMessage] = useState({ type: "", text: "" });
    const [closeLoading, setCloseLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .map((n) => n[0]?.toUpperCase())
            .join("")
            .slice(0, 2);
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: "", color: "" };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 1) return { strength, text: "Weak", color: "text-red-600" };
        if (strength <= 3) return { strength, text: "Medium", color: "text-yellow-600" };
        return { strength, text: "Strong", color: "text-green-600" };
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: "", text: "" });

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage({ type: "error", text: "All fields are required." });
            return;
        }

        if (newPassword === currentPassword) {
            setPasswordMessage({ type: "error", text: "New password must be different from current password." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "New passwords do not match." });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
            return;
        }

        setPasswordLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordMessage({ type: "success", text: data.message });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPasswordMessage({ type: "error", text: data.message });
            }
        } catch (err) {
            setPasswordMessage({ type: "error", text: "Failed to change password. Please try again." });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleCloseAccount = async () => {
        setCloseMessage({ type: "", text: "" });

        if (!closePassword) {
            setCloseMessage({ type: "error", text: "Password is required." });
            return;
        }

        setCloseLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/auth/close-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: closePassword }),
            });

            const data = await res.json();

            if (res.ok) {
                // Clear local storage and redirect
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
                window.location.reload();
            } else {
                setCloseMessage({ type: "error", text: data.message });
                setShowConfirmDialog(false);
            }
        } catch (err) {
            setCloseMessage({ type: "error", text: "Failed to close account. Please try again." });
            setShowConfirmDialog(false);
        } finally {
            setCloseLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 p-6">
                            {/* User Profile Section */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold overflow-hidden mb-4">
                                    {user.photoUrl ? (
                                        <img
                                            src={user.photoUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user.name)
                                    )}
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === "security"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <FiShield size={20} />
                                    Account Security
                                </button>
                                <button
                                    onClick={() => setActiveTab("close")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === "close"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <FiTrash2 size={20} />
                                    Close Account
                                </button>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-8">
                            {activeTab === "security" && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Account</h1>
                                    <p className="text-gray-600 mb-8">
                                        Edit your account settings and change your password here.
                                    </p>

                                    {/* Email Display */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Your email address is <span className="font-medium">{user.email}</span>
                                        </p>
                                    </div>

                                    {/* Password Change Form */}
                                    <form onSubmit={handleChangePassword}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Enter current password"
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Enter new password"
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                                </button>
                                            </div>
                                            {newPassword && (
                                                <p className={`text-sm mt-1 font-medium ${getPasswordStrength(newPassword).color}`}>
                                                    Password strength: {getPasswordStrength(newPassword).text}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Re-type new password"
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        {passwordMessage.text && (
                                            <div
                                                className={`mb-4 p-3 rounded-lg ${passwordMessage.type === "success"
                                                    ? "bg-green-100 text-green-700 border border-green-300"
                                                    : "bg-red-100 text-red-700 border border-red-300"
                                                    }`}
                                            >
                                                {passwordMessage.text}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {passwordLoading ? "Changing..." : "Change password"}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === "close" && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Close Account</h1>
                                    <p className="text-gray-600 mb-8">
                                        Close your account permanently.
                                    </p>

                                    {/* Warning Message */}
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start gap-3">
                                            <FiAlertTriangle className="text-red-500 mt-0.5" size={20} />
                                            <div>
                                                <p className="text-red-700 font-medium mb-2">Warning</p>
                                                <p className="text-red-600 text-sm">
                                                    If you close your account, you will be unsubscribed from all your courses
                                                    and will lose access to your account and data associated with your account forever,
                                                    even if you choose to create a new account using the same email address in the future.
                                                </p>
                                                <p className="text-red-600 text-sm mt-3">
                                                    Please note, if you want to reinstate your account after submitting a deletion request,
                                                    you will have 14 days after the initial submission date to reach out to support to cancel this request.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Confirmation */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Enter your password to confirm
                                        </label>
                                        <input
                                            type="password"
                                            value={closePassword}
                                            onChange={(e) => setClosePassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                        />
                                    </div>

                                    {closeMessage.text && (
                                        <div
                                            className={`mb-4 p-3 rounded-lg ${closeMessage.type === "success"
                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                : "bg-red-100 text-red-700 border border-red-300"
                                                }`}
                                        >
                                            {closeMessage.text}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setShowConfirmDialog(true)}
                                        disabled={!closePassword || closeLoading}
                                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Close account
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Are you sure you want to close your account?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            This action cannot be undone. All your data will be permanently deleted.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCloseAccount}
                                disabled={closeLoading}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {closeLoading ? "Closing..." : "Yes, close my account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;
