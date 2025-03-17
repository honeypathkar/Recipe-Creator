import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { UserDeleteUrl } from "../../API";

const SettingScreen = ({ user, setUser, loading }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete your account? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("authToken"); // Get token from localStorage

        try {
          const response = await axios.delete(UserDeleteUrl, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token for authentication
            },
            withCredentials: true,
          });

          if (response.status === 200) {
            Swal.fire("Deleted!", "Your account has been deleted.", "success");
            setUser(null); // Clear user state
            localStorage.removeItem("authToken"); // Remove token
            navigate("/login"); // Redirect to login page
          }
        } catch (error) {
          console.error("Error deleting account:", error);
          toast.error(
            error.response?.data?.error || "Failed to delete account."
          );
        }
      }
    });
  };

  const handleLogout = async () => {
    setUser([]);
    localStorage.removeItem("authToken");
    navigate("/login");
    toast.success("Logout Successful");
  };

  if (loading) {
    // Spinner while loading
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-6">
        {/* Profile Section */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>
        <div className="flex items-center">
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:flex gap-4 p mt-6">
          <div className="flex-1 bg-gray-100 p-4 rounded-md text-center shadow-sm mb-2">
            <h3 className="text-lg font-medium text-gray-700">Total Recipes</h3>
            <p className="text-2xl font-bold text-gray-800">
              {user.recipes ? user.recipes.length : 0}
            </p>
          </div>
          <div className="flex-1 bg-gray-100 p-4 rounded-md text-center shadow-sm mb-2">
            <h3 className="text-lg font-medium text-gray-700">Favorites</h3>
            <p className="text-2xl font-bold text-gray-800">
              {user.favorites ? user.favorites.length : 0}
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <h2 className="text-xl font-semibold text-red-600 mt-10">
          Danger Zone
        </h2>
        <div className="bg-red-50 p-4 rounded-md mt-4 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-red-600">
                Delete Account
              </h3>
              <p className="text-gray-600 text-sm">
                Once deleted, your account cannot be recovered.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Logout</h3>
              <p className="text-gray-600 text-sm">
                Sign out from all devices.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingScreen;
