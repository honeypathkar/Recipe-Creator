import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { LogoutUrl, UserDeleteUrl } from "../../API"; // Adjust path as needed
import SettingScreenSkeleton from "../components/SettingScreenSkeleton"; // Adjust path as needed
import AccordionItem from "../components/AccordionItem"; // Adjust path as needed

// Import Material Icons
import AccountCircle from "@mui/icons-material/AccountCircle";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import MenuBook from "@mui/icons-material/MenuBook";
import Favorite from "@mui/icons-material/Favorite";
import WarningAmber from "@mui/icons-material/WarningAmber";
import ReportProblem from "@mui/icons-material/ReportProblem";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Rule from "@mui/icons-material/Rule";
import Code from "@mui/icons-material/Code";

// --- Data for Accordion Items ---
const accordionData = [
  {
    id: "how-it-works",
    title: "How App Works",
    icon: Rule,
    content: (
      <>
        <p className="mb-2">
          This app helps you generate recipes based on ingredients you have.
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Go to the 'Recipe' section.</li>
          <li>Enter ingredients or a dish name.</li>
          <li>Select optional parameters like cuisine, language, servings.</li>
          <li>Click 'Generate Recipe' and wait for the AI chef!</li>
          <li>View, save (favorite), or delete your generated recipes.</li>
        </ol>
      </>
    ),
  },
  {
    id: "help",
    title: "Help & Support",
    icon: HelpOutline,
    content: (
      <>
        <p>
          If you encounter any issues or have questions, please contact the
          developer:
        </p>
        <a
          href="mailto:honeypatkar70@gmail.com"
          className="text-blue-600 hover:underline block mt-2"
        >
          honeypatkar70@gmail.com
        </a>
        {/* Add other support links or info here */}
      </>
    ),
  },
  {
    id: "about-dev",
    title: "About Developer",
    icon: Code,
    content: (
      <>
        <p className="mb-2">
          This application was crafted with passion by Honey Pathkar.
        </p>
        <p className="mb-2">
          Find more projects at:{" "}
          <a
            href="https://honeypathkar.github.io/my-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Honey's Portfolio
          </a>
          .
        </p>
        <p>
          Follow on GitHub:{" "}
          <a
            href="https://github.com/honeypathkar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            @honeypathkar
          </a>
          .
        </p>
        <p>
          Follow on Instagram{" "}
          <a
            href="https://instagram.com/honey.jsx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            @honey.jsx
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "about-app",
    title: "About App",
    icon: InfoOutlined,
    content:
      "Recipe Creator AI v1.0. Leveraging the power of AI to inspire your next culinary creation. Built using React, Node.js, Express, MongoDB, and [AI Model Provider].", // Remember to fill in AI Provider if applicable
  },
];
// --- End Accordion Data ---

const SettingScreen = ({ user, setUser, loading, handleLogout }) => {
  const navigate = useNavigate();
  const [openAccordionId, setOpenAccordionId] = useState(null);

  // --- Handlers ---
  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Delete Account?",
      text: "This is permanent and cannot be undone. All your recipes and data will be lost.",
      icon: "warning",
      iconColor: "#d33",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "font-semibold",
        cancelButton: "font-semibold",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Authentication error. Please log in again.");
          return;
        }
        Swal.fire({
          title: "Deleting Account...",
          text: "Please wait.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await axios.delete(UserDeleteUrl, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            Swal.fire("Deleted!", "Your account has been deleted.", "success");
            setUser(null);
            localStorage.removeItem("authToken");
            navigate("/login", { replace: true });
          } else {
            throw new Error(`Unexpected status code: ${response.status}`);
          }
        } catch (error) {
          Swal.close();
          console.error("Error deleting account:", error);
          toast.error(
            `Failed to delete account. ${error?.response?.data?.message || ""}`
          );
        }
      }
    });
  };

  const handleAccordionToggle = (id) => {
    setOpenAccordionId((prevId) => (prevId === id ? null : id));
  };
  // --- End Handlers ---

  // --- Render Logic ---

  if (loading) {
    return <SettingScreenSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        <ReportProblem
          sx={{ fontSize: 64, color: "rgb(239 68 68 / 0.6)", marginBottom: 2 }}
        />
        <p className="text-xl text-slate-600">User data not available.</p>
        <p className="text-slate-500 mt-2">Please try logging in again.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    // Outer container - Apply responsive padding
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      {/* Two-column Flex Container - Use consistent gap */}
      <div className="flex flex-col md:flex-row w-full gap-6 items-start">
        {/* --- Left Column (Main Settings Card) --- */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {/* --- Profile Section --- */}
            <div className="flex items-center pb-6 border-b border-slate-200">
              <div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-semibold mr-4 md:mr-6 shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || (
                  <AccountCircle sx={{ fontSize: "2.5rem" }} />
                )}
              </div>
              {/* Added min-w-0 to prevent overflow */}
              <div className="flex-grow min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1 flex items-center flex-wrap">
                  {/* Added truncate for long names */}
                  <span className="truncate mr-2">
                    {user?.name || "User Name"}
                  </span>
                  {user?.isVerified ? (
                    <span
                      title="Verified Account"
                      // Added flex-shrink-0
                      className="ml-auto sm:ml-2 mt-1 inline-flex items-center bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-200 flex-shrink-0"
                    >
                      <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} /> Verified
                    </span>
                  ) : (
                    <span
                      title="Account Not Verified"
                      // Added flex-shrink-0
                      className="ml-auto sm:ml-2 mt-1 inline-flex items-center bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-red-200 flex-shrink-0"
                    >
                      <Cancel sx={{ fontSize: 16, mr: 0.5 }} /> Not Verified
                    </span>
                  )}
                </h1>
                {/* Use break-words for better email wrapping */}
                <p className="text-slate-600 text-sm md:text-base break-words">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            {/* --- Stats Section --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 py-6 border-b border-slate-200">
              {/* Stat Item 1 */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center transition hover:shadow-md">
                <MenuBook
                  sx={{ fontSize: 32, mr: 1.5 }}
                  className="text-blue-500 flex-shrink-0"
                />
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Total Recipes
                  </h3>
                  <p className="text-2xl font-bold text-slate-800">
                    {user?.recipes?.length ?? 0}
                  </p>
                </div>
              </div>
              {/* Stat Item 2 */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center transition hover:shadow-md">
                <Favorite
                  sx={{ fontSize: 32, mr: 1.5 }}
                  className="text-red-500 flex-shrink-0"
                />
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Favorites
                  </h3>
                  <p className="text-2xl font-bold text-slate-800">
                    {user?.favorites?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* --- Danger Zone --- */}
            <div className="pt-8">
              <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                <WarningAmber sx={{ fontSize: 24, mr: 1 }} /> Danger Zone
              </h2>
              <div className="bg-red-50 p-5 rounded-lg border border-red-200 space-y-5">
                {/* Delete Account Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  {/* Increased bottom margin on mobile */}
                  <div className="mb-3 sm:mb-0 sm:mr-4">
                    <h3 className="text-md font-semibold text-slate-800">
                      Delete Account
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Permanently remove your account and all associated data.
                      This cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 flex-shrink-0 w-full sm:w-auto"
                  >
                    Delete Account
                  </button>
                </div>
                {/* Logout Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-red-200 pt-5">
                  {/* Increased bottom margin on mobile */}
                  <div className="mb-3 sm:mb-0 sm:mr-4">
                    <h3 className="text-md font-semibold text-slate-800">
                      Logout
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Sign out from your current session.
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-slate-200 text-slate-700 px-5 py-2 rounded-md text-sm font-medium hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition duration-200 flex-shrink-0 w-full sm:w-auto"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* End Settings Card */}
        </div>{" "}
        {/* End Left Column */}
        {/* --- Right Column (Accordion Menu) --- */}
        {/* Apply sticky only on medium screens and up */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-lg md:sticky md:top-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-0 border-b border-slate-200 px-4 py-3 md:px-6 md:py-4">
              Information & Help
            </h3>
            <div className="border-t border-slate-200">
              {" "}
              {/* Ensures border consistency */}
              {accordionData.map((item) => (
                <AccordionItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  icon={item.icon}
                  isOpen={openAccordionId === item.id}
                  onToggle={handleAccordionToggle}
                >
                  {item.content}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>{" "}
        {/* End Right Column */}
      </div>{" "}
      {/* End Two Column Flex Container */}
    </div> // End Outer Container
  );
};

export default SettingScreen;
