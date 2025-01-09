import React from "react";

const SettingScreen = ({ user }) => {
  const handleDeleteAccount = () => {
    console.log("Delete Account Clicked");
    // Add functionality for deleting the account
  };

  const handleLogout = () => {
    console.log("Logout Clicked");
    // Add functionality for logging out
  };

  return (
    <div className="flex justify-center items-center p-6">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-6">
        {/* Profile Section */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>
        <div className="flex items-center">
          <img
            src={`data:${user.contentType};base64,${user.image}`}
            alt={user.name}
            className="w-20 h-20 rounded-full border border-gray-300 shadow-md"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 bg-gray-100 p-4 rounded-md text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-700">Total Recipes</h3>
            <p className="text-2xl font-bold text-gray-800">
              {user.recipes.length}
            </p>
          </div>
          <div className="flex-1 bg-gray-100 p-4 rounded-md text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-700">Favorites</h3>
            <p className="text-2xl font-bold text-gray-800">
              {user.favorites.length}
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
