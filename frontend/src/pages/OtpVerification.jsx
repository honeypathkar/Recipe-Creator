import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// Ensure this URL points to the endpoint that verifies { email, otp }
import { VerifyOtp } from "../../API";

const OtpPopup = ({ email, onClose }) => {
  // State to hold OTP values as an array of 6 strings
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Refs for input elements to manage focus
  const inputRefs = useRef([]);

  // Effect to focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handles input change for each OTP box
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
      // Handle clearing the input (e.g., if user selects and deletes)
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
      // Optionally move focus back, but backspace handling might cover this
    }
    // Ignore non-digit inputs other than empty string for clearing
  };

  // Handles key down events, specifically for Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default backspace behavior like navigating back

      const newOtpValues = [...otpValues];

      if (newOtpValues[index] !== "") {
        // If current input has a value, clear it
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
        // Stay focused on the current input after clearing its value
        inputRefs.current[index]?.focus();
      } else if (index > 0) {
        // If current input is already empty and not the first one,
        // move focus to the previous input
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handles pasting into the OTP fields (attach to the first input)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    // Check if pasted data is exactly 6 digits
    if (/^[0-9]{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split("");
      setOtpValues(newOtpValues);
      // Focus the last input after paste
      inputRefs.current[5]?.focus();
    } else {
      toast.warn("Please paste a valid 6-digit OTP.");
    }
  };

  // Verifies the complete OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otpValues.join(""); // Combine array into string

    if (finalOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      // Send the combined OTP string
      const response = await axios.post(VerifyOtp, { email, otp: finalOtp });

      const { token } = response.data; // Assuming token is returned on success
      localStorage.setItem("authToken", token);
      toast.success("OTP Verified Successfully");

      onClose(); // Close popup
      navigate("/home", { replace: true });

      // Consider if reload is truly necessary - often better to manage state
      // window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Invalid OTP or verification failed."
      );
      // Optionally clear OTP fields on error
      // setOtpValues(new Array(6).fill(""));
      // inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-4" // Adjusted padding and max-width
      >
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Sent to {email}. Please check your spam folder too.
        </p>

        {/* Container for the 6 OTP input boxes */}
        <div className="flex justify-center space-x-2 sm:space-x-3 mb-6">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
              type="text" // Use text to better handle single character input and pasting
              inputMode="numeric" // Hint for numeric keyboard on mobile
              maxLength={1} // Each input holds only one digit
              value={value}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()} // Select content on focus
              onPaste={index === 0 ? handlePaste : undefined} // Attach paste handler only to the first input
              required
              aria-label={`OTP digit ${index + 1}`}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center border border-gray-300 rounded-md text-lg sm:text-xl md:text-2xl font-medium focus:ring-2 focus:ring-[#2418ff] focus:border-transparent transition duration-200 ease-in-out"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={handleVerifyOtp}
            disabled={loading || otpValues.join("").length !== 6} // Disable if not 6 digits
            className="w-full bg-[#2418ff] text-white py-2.5 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            onClick={onClose} // Close button action
            className="w-full bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpPopup;
