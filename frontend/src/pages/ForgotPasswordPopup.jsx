import React, { useState } from "react";
import { FaEyeSlash, FaEye, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ForgotPasswordUrl, ResetPasswordWithOtpUrl } from "../../API"; // Adjust path if needed

function ForgotPasswordPopup({ onClose }) {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(ForgotPasswordUrl, { email });
      toast.success(
        response.data?.message || "OTP sent successfully to your email."
      );
      setStep(2); // Move to next step
    } catch (err) {
      console.error("Forgot Password Error:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError("Please enter the OTP and your new password.");
      return;
    }
    // Basic password validation (example)
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(ResetPasswordWithOtpUrl, {
        email, // Send email along with OTP and password
        otp,
        newPassword,
      });
      toast.success(response.data?.message || "Password reset successfully!");
      onClose(); // Close the popup on success
    } catch (err) {
      console.error("Reset Password Error:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to reset password. Invalid OTP or error.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <motion.div
        className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md relative m-4"
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-5 text-center text-gray-800">
          Forgot Password
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-100 p-2 rounded border border-red-300">
            {error}
          </p>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} noValidate>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter your email address and we'll send you an OTP to reset your
              password.
            </p>
            {/* Email Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="forgot-email"
              >
                Email
              </label>
              <input
                type="email"
                id="forgot-email"
                name="email"
                placeholder="Enter your registered email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error on input change
                }}
                required
                disabled={loading}
              />
            </div>

            {/* Send OTP Button */}
            <button
              type="submit"
              className="w-full bg-[#2418ff] text-white py-2.5 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200 disabled:opacity-60"
              disabled={loading || !email}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  <span>Sending OTP...</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} noValidate>
            <p className="text-sm text-gray-600 mb-4 text-center">
              An OTP has been sent to <strong>{email}</strong>. Enter the OTP
              and your new password below.
            </p>
            {/* OTP Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="otp"
              >
                OTP
              </label>
              <input
                type="text" // Use text, handle validation if needed (e.g., numeric)
                id="otp"
                name="otp"
                placeholder="Enter the 6-digit OTP" // Adjust placeholder if OTP length differs
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError(""); // Clear error on input change
                }}
                required
                disabled={loading}
                maxLength={6} // Optional: set max length
              />
            </div>

            {/* New Password Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="new-password"
              >
                New Password
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  name="newPassword"
                  placeholder="Enter your new password"
                  className="outline-none w-full"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(""); // Clear error on input change
                  }}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  disabled={!newPassword || loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              className="w-full bg-[#2418ff] text-white py-2.5 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200 disabled:opacity-60"
              disabled={loading || !otp || !newPassword}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPopup;
