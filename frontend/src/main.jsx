import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi";
import LoadingSpinner from "./components/LoadingSpinner";
import { SocketProvider } from "./context/SocketContext"; 


const Custom = ({ children }) => {
  const { data: user, isLoading } = useLoadUserQuery();

  return <>{isLoading ? <LoadingSpinner /> : <>{children}</>}</>;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <SocketProvider>
        <Custom>
          <App />
          <Toaster />
        </Custom>
      </SocketProvider>
    </Provider>
  </StrictMode>
); 