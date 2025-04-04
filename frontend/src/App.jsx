import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layout/MainLayout";
import { ThemeProvider } from "./components/ThemeProvider";
import HeroSection from "./pages/student/HeroSection";
import Profile from "./pages/Profile";
import { useLoadUserQuery } from "./features/api/authApi";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HeroSection />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  const { isLoading } = useLoadUserQuery(); // Load user on app initialization

  if (isLoading) {
    return <h1 className="text-center text-xl">Loading...</h1>;
  }

  return (
    <ThemeProvider>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  );
}

export default App;