import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginUserMutation } from "../features/api/authApi";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setLoginInput({ ...loginInput, [name]: value });
  };

  const handleLogin = async () => {
    try {
      await loginUser(loginInput);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    if (loginIsSuccess && loginData) {
      localStorage.setItem("authToken", loginData.token);
      localStorage.setItem("userRole", loginData.user.role);
      toast.success(loginData.message || "Login successful.");
      if (loginData.user.role === "captain") {
        navigate("/captain");
      } else {
        navigate("/");
      }
    }
    if (loginError) {
      toast.error(
        loginError.data?.message || "Login failed. Please try again."
      );
    }
  }, [loginIsSuccess, loginData, loginError, navigate]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Blobs */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.25 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.18 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 dark:bg-blue-950 rounded-full blur-3xl z-0"
      />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative w-full max-w-md h-auto overflow-hidden rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-800 bg-white/30 dark:bg-gray-900/60 backdrop-blur-xl p-8 z-10"
        style={{ WebkitBackdropFilter: "blur(18px)", backdropFilter: "blur(18px)" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 text-center mb-2 drop-shadow"
        >
          Welcome Back
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-blue-900/80 dark:text-blue-100/80 text-center mb-6"
        >
          Enter your email and password to log in.
        </motion.p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-5"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-300">
                <FiMail />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                value={loginInput.email}
                onChange={changeInputHandler}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                required
                autoComplete="username"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-300">
                <FiLock />
              </span>
              <input
                type="password"
                name="password"
                id="password"
                value={loginInput.password}
                onChange={changeInputHandler}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white/70 dark:bg-gray-800/80 text-blue-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                required
                autoComplete="current-password"
              />
            </div>
          </motion.div>
          <motion.button
            type="submit"
            disabled={loginIsLoading}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(59,130,246,0.18)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all flex items-center justify-center"
          >
            {loginIsLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <span className="text-sm text-blue-900/80 dark:text-blue-100/80">
            New to MyTrip?{" "}
            <a
              href="/signup"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Create an account
            </a>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;