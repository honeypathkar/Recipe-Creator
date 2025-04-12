import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
// Import BOTH verification URLs/endpoints from your API config file
// CRITICAL: VerifyAccount and VerifyOtp MUST point to DIFFERENT backend endpoints
import { VerifyAccount, VerifyOtp } from "../../API"; // Adjust path if needed

// Accept verificationType ('account' or 'login') and onOtpVerified callback from props
const OtpPopup = ({ email, onClose, verificationType, onOtpVerified }) => {
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false); // Loading state for the Verify button
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus the first input when the popup appears
    inputRefs.current[0]?.focus();
  }, []);

  // --- Input Handlers (Remain the same) ---
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    // Allow only single digits
    if (/^[0-9]$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      // Move focus to the next input if not the last one
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      // Handle clearing the input
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default backspace behavior (like navigating back)
      const newOtpValues = [...otpValues];
      if (newOtpValues[index] !== "") {
        // If current input has a value, clear it
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
        inputRefs.current[index]?.focus(); // Stay on the current input
      } else if (index > 0) {
        // If current input is empty, move focus to the previous input
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    // Check if pasted data is exactly 6 digits
    if (/^[0-9]{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split("");
      setOtpValues(newOtpValues);
      inputRefs.current[5]?.focus(); // Focus the last input after paste
    } else {
      toast.warn("Please paste a valid 6-digit OTP.");
    }
  };
  // --- End Input Handlers ---

  // --- Function specifically for Verifying ACCOUNT (Initial Verification) ---
  const handleVerifyAccountOtp = async () => {
    const finalOtp = otpValues.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      // Call the specific VerifyAccount endpoint
      const response = await axios.post(VerifyAccount, {
        // Uses VerifyAccount URL
        email,
        otp: finalOtp,
      });

      // Call the success callback passed from LoginPage
      if (onOtpVerified) {
        onOtpVerified(response.data); // Pass token, user, message back
      } else {
        // Fallback if callback is missing (shouldn't happen with current LoginPage setup)
        console.error("OtpPopup: onOtpVerified callback is missing!");
        toast.success(response.data.message || "Account Verified Successfully");
        onClose(); // Close popup as a fallback
      }
    } catch (error) {
      console.error("Account Verification error:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Invalid OTP or account verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Function specifically for Verifying OTP for LOGIN ---
  const handleVerifyLoginOtp = async () => {
    const finalOtp = otpValues.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      // Call the specific VerifyOtp (for login) endpoint
      const response = await axios.post(VerifyOtp, {
        // Uses VerifyOtp URL
        email,
        otp: finalOtp,
      });

      // Call the success callback passed from LoginPage
      if (onOtpVerified) {
        onOtpVerified(response.data); // Pass token, user, message back
      } else {
        // Fallback if callback is missing (shouldn't happen with current LoginPage setup)
        console.error("OtpPopup: onOtpVerified callback is missing!");
        toast.success(
          response.data.message || "Login OTP Verified Successfully"
        );
        onClose(); // Close popup as a fallback
      }
    } catch (error) {
      console.error("OTP Login Verification error:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Invalid OTP or login verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Main handler for the "Verify OTP" button click ---
  // This function decides WHICH verification function to call based on the prop
  const handleVerifyClick = () => {
    if (verificationType === "account") {
      handleVerifyAccountOtp(); // Call account verification API
    } else if (verificationType === "login") {
      handleVerifyLoginOtp(); // Call OTP login API
    } else {
      // Should not happen if LoginPage sets the type correctly
      toast.error(
        "Verification configuration error. Please try logging in again."
      );
      console.error(
        "OtpPopup: Cannot verify, unknown or missing verificationType:",
        verificationType
      );
      onClose(); // Close the popup in case of configuration error
    }
  };

  // --- JSX ---
  return (
    // Modal backdrop
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm p-4">
      {/* Animated modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Sent to <span className="font-medium">{email}</span>. Please check
          your spam folder too.
        </p>

        {/* OTP Inputs */}
        <div
          className="flex justify-center space-x-2 sm:space-x-3 mb-6"
          onPaste={handlePaste} // Allow pasting into the container or first input
        >
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
              type="text" // Use text to allow single character input
              inputMode="numeric" // Hint for numeric keyboard on mobile
              autoComplete="one-time-code" // Helps browsers suggest OTPs
              maxLength={1}
              value={value}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()} // Select text on focus for easy replacement
              required
              aria-label={`OTP digit ${index + 1}`}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center border border-gray-300 rounded-md text-lg sm:text-xl md:text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-[#2418ff] focus:border-transparent transition duration-200 ease-in-out"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            // *** This button calls the correct verification logic ***
            onClick={handleVerifyClick} // Calls the dispatcher function
            disabled={loading || otpValues.join("").length !== 6} // Disable if loading or OTP incomplete
            className="w-full bg-[#2418ff] text-white py-2.5 px-4 rounded-lg hover:bg-[#231bcd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2418ff] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>
          <button
            onClick={onClose} // Calls the handleCloseOtpPopup in LoginPage
            disabled={loading} // Disable cancel while verifying
            className="w-full bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 font-medium disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpPopup;
