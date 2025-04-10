import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion
import RegisterImage from "../images/register-image.png";
import axios from "axios";
import { RegisterUrl } from "../../API";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        RegisterUrl,
        formData, // Send form data directly
        {
          headers: {
            "Content-Type": "application/json", // Set correct content type
          },
          withCredentials: true, // Include credentials if needed
        }
      );

      // if (response.status === 200) {
      navigate("/login");
      toast.success("Registered Successfully");
      // }
    } catch (err) {
      if (err.response) {
        // Handle specific HTTP errors
        if (err.response.status === 400) {
          toast.error("User already exists");
        } else {
          toast.error(err.response.data.message || "Failed to register user");
        }
      } else {
        console.error("Error submitting the form:", err);
        toast.error("Error occurred. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap min-h-screen">
      {/* Form Section */}
      <motion.div
        className="flex items-center justify-center w-full lg:w-1/2 lg:bg-[#2418ff] bg-gray-100"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <form
          className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Register Form</h2>

          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 flex justify-between items-center">
              <input
                type={show ? "text" : "password"}
                className="outline-none w-full"
                required
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
                className="disabled:text-gray-400"
                disabled={!formData.password}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2418ff] text-white py-2 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200 disabled:opacity-60"
            disabled={
              loading || !formData.email || !formData.password || !formData.name
            } // Disable the button when loading
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <div class="w-8 h-8 border-4 border-t-[#2418ff] border-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
          <div className="flex justify-center mt-5">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="text-[#2418ff] hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </form>
      </motion.div>
      {/* Image Section */}
      <motion.div
        className="hidden lg:flex items-center justify-center bg-white w-full lg:w-1/2"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={RegisterImage}
          alt="Register illustration"
          className="w-3/4 max-h-screen object-contain"
        />
      </motion.div>
    </div>
  );
}

export default RegisterPage;
