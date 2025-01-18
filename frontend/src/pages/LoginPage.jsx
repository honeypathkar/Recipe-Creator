import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

function LoginScreen({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/userLogin", {
        method: "POST",
        credentials: "include", // Important for cookies
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      // console.log(result);
      if (response.ok) {
        // Navigate to home page after successful login
        setUser(result);
        navigate("/home", { replace: true });
        window.location.reload();
        toast.success("Login Successfull");

        // Clear history to prevent going back to the login screen
        window.history.pushState(null, document.title, location.href);
      } else {
        // alert(result.error || "Login failed");
        toast.error(result.error || "Login Failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // alert("Login failed. Please try again later.");
      toast.error("Login failed. Please try again later.");
    }
  };

  useEffect(() => {
    // Prevent going back to the login screen after login
    window.history.pushState(null, document.title, location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, location.href);
    });

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("popstate", function (event) {
        window.history.pushState(null, document.title, location.href);
      });
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login Form</h2>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Eamil"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
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
              className="disabled:text-gray-400"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
        <div className="flex justify-center mt-5">
          Don't Have an Account? &nbsp;
          <Link to="/register" className="text-blue-500">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginScreen;
