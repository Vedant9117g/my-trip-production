import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layout/MainLayout";
import { ThemeProvider } from "./components/ThemeProvider";
import Profile from "./pages/Profile";
import { useLoadUserQuery } from "./features/api/authApi";
import Home from "./pages/Home";
import InstantRide from "./pages/InstantRide";
import ScheduledRide from "./pages/ScheduledRide";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
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
      {
        path: "instant-ride",
        element: <InstantRide />, // Add this component
      },
      {
        path: "scheduled-rides",
        element: <ScheduledRide />, // Add this component
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
