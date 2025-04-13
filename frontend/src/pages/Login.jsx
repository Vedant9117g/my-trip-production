import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginUserMutation } from "../features/api/authApi";

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
      // Save token and optionally user data
      localStorage.setItem("authToken", loginData.token);
      localStorage.setItem("userRole", loginData.user.role); // Store role

      toast.success(loginData.message || "Login successful.");

      // Redirect based on role
      if (loginData.user.role === "captain") {
        navigate("/captain");
      } else {
        navigate("/"); // Regular users
      }
    }

    if (loginError) {
      toast.error(
        loginError.data?.message || "Login failed. Please try again."
      );
    }
  }, [loginIsSuccess, loginData, loginError, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          Login
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Enter your email and password to log in.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={loginInput.email}
              onChange={changeInputHandler}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={loginInput.password}
              onChange={changeInputHandler}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loginIsLoading}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
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
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
