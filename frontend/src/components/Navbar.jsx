import React, { useState, useRef, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../features/api/authApi";
import { userLoggedOut } from "../features/authSlice";
import { useTheme } from "../components/ThemeProvider";
import { Sun, Moon, Bell, Car, User, LogOut } from "lucide-react";
import axios from "axios";
import RideDetailsDialog from "./RideDetailsDialog";
import NotificationsDropdown from "./NotificationsDropdown"; // Import NotificationsDropdown
import { AiFillCar } from "react-icons/ai";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [logoutUser] = useLogoutUserMutation();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(userLoggedOut());
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (notification.rideId) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:5000/api/rides/${notification.rideId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setSelectedRide(response.data.ride); // Open ride details dialog
      } catch (error) {
        console.error("Failed to fetch ride details:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-900 p-4 flex justify-between items-center shadow-md z-10 border-b border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <button
        onClick={() => navigate(user?.role === "captain" ? "/captain" : "/")}
        className="flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-all"
      >
        <Car className="h-8 w-8" />
        Crazy Rides
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">
        {user ? (
          <>
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setNotificationOpen((prev) => !prev);
                  setProfileMenuOpen(false); // Close profile if open
                }}
                className="relative"
              >
                <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationOpen && (
                <NotificationsDropdown
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                onClose={() => setNotificationOpen(false)} // Close the dropdown
              />
              )}
            </div>

            {/* Profile with Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileMenuOpen((prev) => !prev);
                  setNotificationOpen(false); // Close notifications if open
                }}
                className="h-10 w-10 rounded-full overflow-hidden border-2 border-indigo-400 focus:outline-none"
              >
                <img
                  src={user?.profilePhoto || "https://github.com/shadcn.png"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>

                  <Link
                    to="/my-rides"
                    className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <AiFillCar className="h-5 w-5" />
                    My Rides
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all"
            >
              Login
            </Link>
          </>
        )}

        {/* Theme Toggler */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full border-2 border-indigo-400 bg-white dark:bg-gray-800 hover:scale-110 transition-all"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Ride Details Dialog */}
      {selectedRide && (
        <RideDetailsDialog
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          loggedInUser={user}
        />
      )}
    </nav>
  );
};

export default Navbar;
