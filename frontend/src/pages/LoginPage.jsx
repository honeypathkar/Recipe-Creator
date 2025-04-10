import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import LoginImage from "../images/login-image.png";
import { LoginUrl } from "../../API"; // Make sure API URLs are correctly imported
import axios from "axios";
import OtpPopup from "./OtpVerification"; // Assuming you still use this based on the code

function LoginPage({ setUser }) {
  // Pass setUser if needed by your app logic
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showOtpPopup, setShowOtpPopup] = useState(false); // State for OTP popup visibility
  const [emailForOtp, setEmailForOtp] = useState(""); // State to pass email to OTP popup

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(LoginUrl, formData, {
        withCredentials: true, // Keep this if your backend requires cookies
      });

      // Destructure response data carefully
      const { otpRequired, token, message } = response.data;
      console.log(response.data);

      if (otpRequired) {
        // If OTP verification is needed, show the popup
        setEmailForOtp(formData.email); // Set the email to pass to the popup
        toast.info(message || "OTP sent to your email for verification."); // Use info or success
        setShowOtpPopup(true); // Show the OTP popup
      } else {
        // If no OTP is required, proceed to home (Login successful)
        localStorage.setItem("authToken", token);
        toast.success(message || "Login Successful");
        navigate("/home", { replace: true }); // Navigate using React Router
      }
    } catch (error) {
      console.error("Login error:", error);
      // Display specific error from backend if available
      toast.error(
        error.response?.data?.error ||
          "Login Failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Effect to redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Optional: Add token validation here before navigating
      console.log("User already logged in, navigating to home.");
      navigate("/home", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Close OTP popup handler
  const handleCloseOtpPopup = () => {
    setShowOtpPopup(false);
    setEmailForOtp(""); // Clear the email when popup closes
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
        className="flex items-center justify-center w-full lg:w-1/2 lg:bg-[#2418ff] bg-gray-100 p-4" // Added padding
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
      >
        <motion.form
          className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
          onSubmit={handleSubmit}
          noValidate // Prevent default browser validation, rely on custom logic/toasts
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
              id="email" // Added id for label association
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleInputChange}
              required // Added basic required attribute
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2418ff] text-white py-2.5 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200 disabled:opacity-60" // Adjusted padding/disabled style
            disabled={loading || !formData.email || !formData.password} // Disable if loading or fields empty
          >
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

          {/* Link to Register */}
          <div className="text-center mt-5">
            {" "}
            {/* Centered text */}
            Don't have an account?&nbsp;
            <Link
              to="/register"
              className="text-[#2418ff] hover:underline font-medium"
            >
              Create Account
            </Link>
          </div>
          {/* Optional: Add Forgot Password link */}
          <div className="text-center mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:text-[#2418ff] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </motion.form>
      </motion.div>

      {/* Render OTP Popup Conditionally */}
      {showOtpPopup && (
        <OtpPopup email={emailForOtp} onClose={handleCloseOtpPopup} />
      )}
    </div>
  );
}

export default LoginPage;
