import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import LoginImage from "../images/login-image.png";
import { LoginUrl } from "../../API";
import axios from "axios";
import OtpPopup from "./OtpVerification";
import ForgotPasswordPopup from "./ForgotPasswordPopup"; // <-- Import the new component

function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false); // <-- State for Forgot Password popup

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(LoginUrl, formData, {
        withCredentials: true,
      });
      const { otpRequired, token, message } = response.data;

      if (otpRequired) {
        setEmailForOtp(formData.email);
        toast.info(message || "OTP sent to your email for verification.");
        setShowOtpPopup(true);
      } else {
        localStorage.setItem("authToken", token);
        toast.success(message || "Login Successful");
        // Pass user data if available from login response, otherwise AppWrapper fetches it
        // Example: if (response.data.user) setUser(response.data.user);
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error ||
          "Login Failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseOtpPopup = () => {
    setShowOtpPopup(false);
    setEmailForOtp("");
  };

  // --- Handlers for Forgot Password Popup ---
  const handleOpenForgotPassword = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPasswordPopup(false);
  };
  // --- End Handlers ---

  return (
    <div className="flex flex-wrap min-h-screen">
      {/* Image Section (remains the same) */}
      <motion.div
        className="hidden lg:flex items-center justify-center bg-white w-full lg:w-1/2"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
      >
        <img
          src={LoginImage}
          alt="Login illustration"
          className="w-3/4 max-h-screen object-contain"
        />
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="flex items-center justify-center w-full lg:w-1/2 lg:bg-[#2418ff] bg-gray-100 p-4"
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
      >
        <motion.form
          className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login Form
          </h2>

          {/* Email Field (remains the same) */}
          <div className="mb-4">
            {/* ... email input code ... */}
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email" // Added id for label association
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleInputChange}
              required // Added basic required attribute
            />
          </div>

          {/* Password Field (remains the same) */}
          <div className="mb-4">
            {/* ... password input code ... */}
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500">
              {" "}
              {/* Added focus ring to wrapper */}
              <input
                type={show ? "text" : "password"}
                id="password" // Added id
                name="password"
                placeholder="Enter your password"
                className="outline-none w-full" // Removed focus styles here
                value={formData.password}
                onChange={handleInputChange}
                required // Added basic required attribute
              />
              <button
                type="button"
                // Disable toggle only if password field is empty
                disabled={!formData.password}
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
                className="ml-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed" // Adjusted styling
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button (remains the same) */}
          <button
            type="submit"
            className="w-full bg-[#2418ff] text-white py-2.5 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200 disabled:opacity-60"
            disabled={loading || !formData.email || !formData.password}
          >
            {/* ... loading indicator code ... */}
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                {/* Simple spinner using border */}
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>

          {/* Link to Register (remains the same) */}
          <div className="text-center mt-5">
            {/* ... register link code ... */}
            Don't have an account?&nbsp;
            <Link
              to="/register"
              className="text-[#2418ff] hover:underline font-medium"
            >
              Create Account
            </Link>
          </div>

          {/* --- Updated Forgot Password Link --- */}
          <div className="text-center mt-2">
            <button
              type="button" // Important: type="button" so it doesn't submit the form
              onClick={handleOpenForgotPassword} // Trigger the popup
              className="text-sm text-gray-600 hover:text-[#2418ff] hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
          {/* --- End Update --- */}
        </motion.form>
      </motion.div>

      {/* Render Popups Conditionally using AnimatePresence for exit animations */}
      <AnimatePresence>
        {showOtpPopup && (
          <OtpPopup email={emailForOtp} onClose={handleCloseOtpPopup} />
        )}
        {showForgotPasswordPopup && ( // <-- Render Forgot Password Popup
          <ForgotPasswordPopup onClose={handleCloseForgotPassword} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoginPage;
