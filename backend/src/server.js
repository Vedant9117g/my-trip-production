const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const mapRoutes = require("./routes/mapRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend to send cookies
app.use(express.json());
app.use(cookieParser()); // Enable reading cookies

// Routes
app.use("/api/maps", mapRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Ride Finder API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
