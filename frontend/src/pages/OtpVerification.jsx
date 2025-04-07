import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { VerifyOtp } from "../../API";

const OtpPopup = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    setLoading(true);

    try {
      const response = await axios.post(VerifyOtp, { email, otp });

      const { token } = response.data;
      localStorage.setItem("authToken", token);
      toast.success("OTP Verified Successfully");

      onClose(); // Close popup
      navigate("/home", { replace: true });
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          Enter OTP that was sent to your email
        </h2>
        <p>Also check spam folder</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-lg"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-[#2418ff] text-white py-2 rounded-lg hover:bg-[#231bcd] transition duration-200"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpPopup;
