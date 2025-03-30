const { Server } = require("socket.io");

// In-memory mapping of user IDs to socket IDs
const userSocketMap = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for user authentication and map user ID to socket ID
    socket.on("join", (userId) => {
      userSocketMap.set(userId, socket.id); // Map user ID to socket ID
      console.log(`User ${userId} joined with socket ID ${socket.id}`);
      console.log("Current userSocketMap:", Array.from(userSocketMap.entries())); // Debugging log
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      // Remove the user from the map
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`Removed user ${userId} from socket map`);
          break;
        }
      }
    });
  });

  return io;
}

// Function to get socket ID from user ID
function getSocketIdFromUserId(userId) {
  return userSocketMap.get(userId);
}

module.exports = { setupSocket, getSocketIdFromUserId };