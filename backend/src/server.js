
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { initializeSocket } = require("./socket"); // Import initializeSocket

const mapRoutes = require("./routes/mapRoutes");
const userRoutes = require("./routes/userRoutes");
const rideRoutes = require("./routes/rideRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); // Import notification routes
const messageRoutes = require("./routes/messageRoute"); // Import message routes

connectDB();

const app = express();
const server = http.createServer(app); // Initialize the server here

const io = initializeSocket(server); // Pass the server to initializeSocket

const allowedOrigins = [
  "http://localhost:5174", // Local development
  "https://86gwq826-5174.inc1.devtunnels.ms", // Forwarded URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io; // Attach Socket.io to requests
  next();
});

// Routes
app.use("/api/maps", mapRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes); // Add message routes

app.get("/", (req, res) => {
  res.send("Ride Finder API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
