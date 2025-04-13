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
import RideDetails from "./pages/RideDetails"; // ✅ Import the new component
import CaptainHome from "./pages/CaptainHome";

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
        element: <InstantRide />,
      },
      {
        path: "scheduled-rides",
        element: <ScheduledRide />,
      },
      {
        path: "ride/:id", // ✅ New route for ride details
        element: <RideDetails />,
      },
      {
        path: "captain",
        element: <CaptainHome />,
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
