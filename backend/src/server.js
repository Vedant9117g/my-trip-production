const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { setupSocket } = require("./socket");

const mapRoutes = require("./routes/mapRoutes");
const userRoutes = require("./routes/userRoutes");
const rideRoutes = require("./routes/rideRoutes");

connectDB();

const app = express();
const server = http.createServer(app);
const io = setupSocket(server); // Initialize Socket.io

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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

app.get("/", (req, res) => {
  res.send("Ride Finder API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
