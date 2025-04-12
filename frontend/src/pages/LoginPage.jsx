import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import LoginImage from "../images/login-image.png"; // Adjust path if needed
// Import all necessary API URLs - Make sure these names match your API file
// Ensure LoginUrl, SendOtp, VerifyAccount, VerifyOtp are defined in ../../API
import { LoginUrl, SendOtp } from "../../API"; // Adjust path if needed
import axios from "axios";
import OtpPopup from "./OtpVerification"; // Adjust path if needed
import ForgotPasswordPopup from "./ForgotPasswordPopup"; // Adjust path if needed

function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false); // Loading for email/password submit
  const [otpSending, setOtpSending] = useState(false); // Loading for "Login with OTP" button
  const navigate = useNavigate();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  // State to track the *purpose* of the OTP verification: 'account' or 'login'
  const [otpVerificationType, setOtpVerificationType] = useState(null);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handles login with Email and Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(LoginUrl, formData, {
        withCredentials: true, // Keep if needed for cookies/sessions
      });
      // Destructure response data
      const { otpRequired, token, message, user } = response.data;

      if (otpRequired) {
        // === SCENARIO 1: Email/Password Login REQUIRES Account Verification ===
        setEmailForOtp(formData.email);
        setOtpVerificationType("account"); // Set type for OtpPopup
        toast.info(
          message || "Account not verified. OTP sent for verification."
        );
        setShowOtpPopup(true); // Show popup for account verification
      } else {
        // === SCENARIO 2: Email/Password Login SUCCESSFUL (Account already verified) ===
        handleSuccessfulLogin(token, user, message || "Login Successful");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Login Failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handles sending OTP for passwordless LOGIN
  const handleSendOtp = async () => {
    const { email } = formData;
    if (!email) {
      toast.warn("Please enter your email address first.");
      return;
    }
    setOtpSending(true);
    try {
      // Calls API to *send* OTP specifically for login purposes
      const response = await axios.post(SendOtp, { email }); // Use SendOtp URL

      // === SCENARIO 3: "Login with OTP" button clicked ===
      setEmailForOtp(email);
      setOtpVerificationType("login"); // Set type for OtpPopup
      toast.info("OTP sent to your email address.");
      setShowOtpPopup(true); // Show popup for login verification
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP. Please check the email or try again."
      );
    } finally {
      setOtpSending(false);
    }
  };

  // Central function after successful login OR successful OTP verification (for login OR account)
  const handleSuccessfulLogin = (token, user, successMessage) => {
    localStorage.setItem("authToken", token);
    toast.success(successMessage);
    if (setUser && user) {
      setUser(user); // Update global user state if function provided
    }
    navigate("/home", { replace: true });
    // Clean up state related to OTP popup
    setShowOtpPopup(false);
    setEmailForOtp("");
    setOtpVerificationType(null);
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  // Close OTP popup and reset related state
  const handleCloseOtpPopup = () => {
    setShowOtpPopup(false);
    setEmailForOtp("");
    setOtpVerificationType(null); // Reset type on close
  };

  const handleOpenForgotPassword = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPasswordPopup(false);
  };

  return (
    <div className="flex flex-wrap min-h-screen">
      {/* Image Section */}
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
          onSubmit={handleSubmit} // Handles email/password submission
          noValidate
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login Form
          </h2>

          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type={show ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="outline-none w-full"
                value={formData.password}
                onChange={handleInputChange}
                required // HTML5 validation, use JS for better UX if needed
              />
              <button
                type="button"
                disabled={!formData.password}
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
                className="ml-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button (Email/Password Login) */}
          <button
            type="submit" // Triggers handleSubmit
            className="w-full bg-[#2418ff] text-white py-2.5 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200 disabled:opacity-60 mb-3"
            disabled={
              loading || !formData.email || !formData.password || otpSending
            } // Disable if loading, missing fields, or sending OTP
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>

          {/* OR Separator */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500 font-medium">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Button: Login via OTP */}
          <button
            type="button" // Important: type="button" prevents form submission
            onClick={handleSendOtp} // Triggers OTP sending process
            className="w-full bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition duration-200 disabled:opacity-60 mb-4"
            disabled={otpSending || !formData.email || loading} // Disable if sending OTP, missing email, or logging in
          >
            {otpSending ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-5 h-5 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
                <span>Sending OTP...</span>
              </div>
            ) : (
              "Login with OTP"
            )}
          </button>

          {/* Links */}
          <div className="text-center mt-2">
            Don't have an account?&nbsp;
            <Link
              to="/register" // Ensure you have a route for /register
              className="text-[#2418ff] hover:underline font-medium"
            >
              Create Account
            </Link>
          </div>
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={handleOpenForgotPassword}
              className="text-sm text-gray-600 hover:text-[#2418ff] hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
        </motion.form>
      </motion.div>

      {/* Popups */}
      <AnimatePresence>
        {showOtpPopup && (
          <OtpPopup
            key="otpPopup" // Key for AnimatePresence exit animation
            email={emailForOtp}
            onClose={handleCloseOtpPopup}
            // This prop tells OtpPopup WHICH verification to perform:
            verificationType={otpVerificationType} // Will be 'account' or 'login'
            // This callback handles the successful response from EITHER verification:
            onOtpVerified={(responseData) => {
              // Pass data (token, user, message) to the central login handler
              handleSuccessfulLogin(
                responseData.token,
                responseData.user,
                responseData.message || "Verification Successful!"
              );
            }}
          />
        )}
        {showForgotPasswordPopup && (
          <ForgotPasswordPopup
            key="forgotPasswordPopup" // Key for AnimatePresence
            onClose={handleCloseForgotPassword}
            // Add necessary props for forgot password functionality
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoginPage;
