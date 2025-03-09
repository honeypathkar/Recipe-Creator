import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import LoginImage from "../images/login-image.png";

function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({
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
    setLoading(true); // Set loading to true when the form is submitted
    try {
      const response = await fetch("http://localhost:5001/userLogin", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (response.ok) {
        setUser(result);
        navigate("/home", { replace: true });
        toast.success("Login Successful");
        window.history.pushState(null, document.title, location.href);
        window.location.reload();
      } else {
        toast.error(result.error || "Login Failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false once the process is complete
    }
  };

  useEffect(() => {
    window.history.pushState(null, document.title, location.href);
    const preventBack = () =>
      window.history.pushState(null, document.title, location.href);

    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  const imageVariants = {
    hidden: { opacity: 0, x: -200 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 200 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="flex flex-wrap min-h-screen">
      {/* Image Section */}
      <motion.div
        className="hidden lg:flex items-center justify-center bg-white w-full lg:w-1/2"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <img
          src={LoginImage}
          alt="Login illustration"
          className="w-3/4 max-h-screen object-contain"
        />
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="flex items-center justify-center w-full lg:w-1/2 lg:bg-[#2418ff] bg-gray-100"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.form
          className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login Form
          </h2>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
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
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between">
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="outline-none w-full"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                disabled={!formData.password}
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
                className="ml-2 disabled:text-gray-400"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2418ff] text-white py-2 px-4 rounded-lg hover:bg-[#231bcd] transition duration-200"
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <div class="w-8 h-8 border-4 border-t-[#2418ff] border-white rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>

          <div className="flex justify-center mt-5">
            Don't have an account?&nbsp;
            <Link to="/register" className="text-[#2418ff]">
              Create Account
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
