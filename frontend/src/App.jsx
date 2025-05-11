import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layout/MainLayout";
import { ThemeProvider } from "./components/ThemeProvider";
import Profile from "./pages/Profile";
import { useLoadUserQuery } from "./features/api/authApi";
import Home from "./pages/Home";
import ScheduledRide from "./pages/ScheduledRide";
import RideDetails from "./pages/RideDetails"; // ✅ Import the ride details component
import CaptainHome from "./pages/CaptainHome";
import WaitingForDriver from "./components/passanger/WaitingForDriver"; // ✅ Import the new WaitingForDriver component
import InstantRideDetail from "./pages/InstantRideDetail";

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
        path: "scheduled-rides",
        element: <ScheduledRide />,
      },
      {
        path: "ride/:id", // ✅ Route for ride details
        element: <RideDetails />,
      },
      {
        path: "captain",
        element: <CaptainHome />,
      },
      {
        path: "waiting-for-driver", // ✅ New route for WaitingForDriver
        element: <WaitingForDriver />,
      },
      {
        path: "/instant-ride-detail", // ✅ New route for WaitingForDriver
        element:<InstantRideDetail />
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